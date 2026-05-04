import { Outlet, useLocation } from "react-router-dom";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import Conversaciones from "./Conversaciones";
import { useLanguage } from "context/LanguageContext";

export function PlaceholderChat() {
  const { tx } = useLanguage();
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center px-6">
      <ChatBubbleLeftRightIcon className="h-14 w-14 text-slate-200" />
      <p className="text-sm font-medium text-slate-500">{tx("Selecciona una conversación")}</p>
      <p className="text-xs text-slate-400">{tx("Aquí aparecerán tus mensajes")}</p>
    </div>
  );
}

function MensajesLayout() {
  const location = useLocation();
  const tengoChat = /\/mensajes\/.+/.test(location.pathname);

  return (
    <div className="-mx-6 -mb-6 flex h-[calc(100vh-5.5rem)] overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-sm">

      {/* Panel izquierdo: lista de conversaciones */}
      <div
        className={`
          ${tengoChat ? "hidden lg:flex" : "flex"}
          w-full flex-none flex-col overflow-hidden border-r border-slate-200 lg:w-80
        `}
      >
        <Conversaciones panelMode />
      </div>

      {/* Panel derecho: chat activo o placeholder */}
      <div className={`${tengoChat ? "flex" : "hidden lg:flex"} flex-1 flex-col overflow-hidden bg-slate-50`}>
        <Outlet />
      </div>

    </div>
  );
}

export default MensajesLayout;
