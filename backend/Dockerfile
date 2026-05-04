# ── Fase 1: build ────────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Capa de dependencias separada: se reconstruye solo si cambia pom.xml
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn
RUN chmod +x mvnw && ./mvnw dependency:go-offline -q

COPY src ./src
RUN ./mvnw package -DskipTests -q

# ── Fase 2: runtime ───────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S jobfree && adduser -S jobfree -G jobfree

COPY --from=build /app/target/*.jar app.jar

RUN mkdir -p /app/uploads && chown -R jobfree:jobfree /app

USER jobfree

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
