import { Client } from "@stomp/stompjs";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import API_URL from "api/config";

const ChatSocketContext = createContext(null);

function buildWebSocketUrl() {
  if (API_URL.startsWith("http")) {
    return `${API_URL.replace(/^http/i, "ws")}/ws`;
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/ws`;
}

function parseEvent(body) {
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

function normalizePersonalEvent(evento) {
  if (evento?.tipo !== "usuario.mensajes.actualizados" || !evento.actualizacion) {
    return evento;
  }

  return {
    ...evento,
    conversacionId: evento.conversacionId ?? evento.actualizacion.conversacionId,
    mensajeIds: evento.actualizacion.mensajeIds,
    mensajes: evento.actualizacion.mensajes,
    actualizacionTipo: evento.actualizacionTipo ?? evento.actualizacion.tipo,
  };
}

export function ChatSocketProvider({ children }) {
  const { usuario, cargando } = useAuth();
  const [connected, setConnected] = useState(false);
  const [rawConnectionState, setRawConnectionState] = useState("disconnected");
  const [connectionState, setConnectionState] = useState("disconnected");
  const [reconnectVersion, setReconnectVersion] = useState(0);
  const hasConnectedRef = useRef(false);
  const connectionStateTimeoutRef = useRef(null);

  const clientRef = useRef(null);
  const personalSubscriptionRef = useRef(null);
  const personalListenersRef = useRef(new Set());
  const conversationListenersRef = useRef(new Map());
  const conversationSubscriptionsRef = useRef(new Map());

  const dispatchPersonalEvent = useCallback((evento) => {
    const normalized = normalizePersonalEvent(evento);
    personalListenersRef.current.forEach((listener) => listener(normalized));
  }, []);

  const dispatchConversationEvent = useCallback((conversacionId, evento) => {
    const listeners = conversationListenersRef.current.get(conversacionId);
    if (!listeners) return;
    listeners.forEach((listener) => listener(evento));
  }, []);

  const ensureConversationSubscription = useCallback((conversacionId) => {
    const client = clientRef.current;
    if (!client?.connected || conversationSubscriptionsRef.current.has(conversacionId)) {
      return;
    }

    const subscription = client.subscribe(`/topic/conversaciones/${conversacionId}`, (message) => {
      const evento = parseEvent(message.body);
      if (!evento) return;
      dispatchConversationEvent(conversacionId, evento);
    });

    conversationSubscriptionsRef.current.set(conversacionId, subscription);
  }, [dispatchConversationEvent]);

  const teardownConversationSubscription = useCallback((conversacionId) => {
    const listeners = conversationListenersRef.current.get(conversacionId);
    if (listeners && listeners.size > 0) return;

    const subscription = conversationSubscriptionsRef.current.get(conversacionId);
    if (subscription) {
      subscription.unsubscribe();
      conversationSubscriptionsRef.current.delete(conversacionId);
    }

    conversationListenersRef.current.delete(conversacionId);
  }, []);

  useEffect(() => {
    if (cargando) return undefined;

    if (!usuario?.id) {
      setConnected(false);
      setRawConnectionState("disconnected");
      setConnectionState("disconnected");
      hasConnectedRef.current = false;
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
      personalSubscriptionRef.current = null;
      const conversationSubscriptions = conversationSubscriptionsRef.current;
      conversationSubscriptions.clear();
      return undefined;
    }

    const client = new Client({
      brokerURL: buildWebSocketUrl(),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: () => {},
      beforeConnect: () => {
        setRawConnectionState(hasConnectedRef.current ? "reconnecting" : "connecting");
      },
      onConnect: () => {
        setConnected(true);
        setRawConnectionState("connected");
        setReconnectVersion((prev) => prev + 1);
        hasConnectedRef.current = true;

        if (!personalSubscriptionRef.current) {
          personalSubscriptionRef.current = client.subscribe("/user/queue/conversaciones", (message) => {
            const evento = parseEvent(message.body);
            if (!evento) return;
            dispatchPersonalEvent(evento);
          });
        }

        conversationListenersRef.current.forEach((_, conversacionId) => {
          ensureConversationSubscription(conversacionId);
        });
      },
      onWebSocketClose: () => {
        setConnected(false);
        setRawConnectionState(hasConnectedRef.current ? "reconnecting" : "disconnected");
        personalSubscriptionRef.current = null;
        conversationSubscriptionsRef.current.clear();
      },
      onStompError: () => {
        setConnected(false);
        setRawConnectionState("reconnecting");
      },
    });

    client.activate();
    clientRef.current = client;
    const conversationSubscriptions = conversationSubscriptionsRef.current;

    return () => {
      setConnected(false);
      setRawConnectionState("disconnected");
      setConnectionState("disconnected");
      personalSubscriptionRef.current = null;
      conversationSubscriptions.clear();
      client.deactivate();
      if (clientRef.current === client) {
        clientRef.current = null;
      }
    };
  }, [usuario?.id, cargando, dispatchPersonalEvent, ensureConversationSubscription]);

  useEffect(() => {
    if (connectionStateTimeoutRef.current) {
      window.clearTimeout(connectionStateTimeoutRef.current);
      connectionStateTimeoutRef.current = null;
    }

    if (rawConnectionState === "connected" || rawConnectionState === "connecting") {
      setConnectionState(rawConnectionState);
      return undefined;
    }

    connectionStateTimeoutRef.current = window.setTimeout(() => {
      setConnectionState(rawConnectionState);
      connectionStateTimeoutRef.current = null;
    }, 900);

    return () => {
      if (connectionStateTimeoutRef.current) {
        window.clearTimeout(connectionStateTimeoutRef.current);
        connectionStateTimeoutRef.current = null;
      }
    };
  }, [rawConnectionState]);

  const value = useMemo(() => ({
    connected,
    connectionState,
    reconnectVersion,
    subscribeToUserQueue(callback) {
      personalListenersRef.current.add(callback);
      return () => {
        personalListenersRef.current.delete(callback);
      };
    },
    subscribeToConversation(conversacionId, callback) {
      const key = String(conversacionId);
      const listeners = conversationListenersRef.current.get(key) ?? new Set();
      listeners.add(callback);
      conversationListenersRef.current.set(key, listeners);
      ensureConversationSubscription(key);

      return () => {
        const current = conversationListenersRef.current.get(key);
        if (!current) return;
        current.delete(callback);
        teardownConversationSubscription(key);
      };
    },
    publish(destination, body) {
      const client = clientRef.current;
      if (client?.connected) {
        client.publish({ destination, body: JSON.stringify(body) });
      }
    },
  }), [connected, connectionState, reconnectVersion, ensureConversationSubscription, teardownConversationSubscription]);

  return (
    <ChatSocketContext.Provider value={value}>
      {children}
    </ChatSocketContext.Provider>
  );
}

export function useChatSocket() {
  return useContext(ChatSocketContext);
}
