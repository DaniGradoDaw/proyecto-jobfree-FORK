<div align="center">

# JobFree — Marketplace de Servicios del Hogar

> Plataforma web full-stack que conecta clientes con profesionales de servicios a domicilio: mantenimiento, reparaciones y cuidado personal.

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com)
[![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com)

**Proyecto Final Intermodular — DAW**

</div>

---

## ¿Qué es JobFree?

JobFree es una **plataforma web full-stack** que actúa como marketplace entre clientes que necesitan servicios del hogar y profesionales que los ofrecen. Los clientes pueden buscar, comparar y reservar servicios según su ubicación a través de un **mapa interactivo**; los profesionales gestionan su catálogo y disponibilidad desde su propio panel.

---

## Funcionalidades principales

### Para clientes
- Búsqueda y comparación de profesionales por tipo de servicio y zona
- Localización en mapa interactivo (Leaflet + OpenStreetMap)
- Reserva y gestión de citas
- Pago seguro integrado con **Stripe**
- Historial de servicios contratados

### Para profesionales
- Gestión del catálogo de servicios ofrecidos
- Control de disponibilidad y agenda
- Perfil público con valoraciones

### Sistema
- Autenticación y autorización con **Spring Security**
- Roles diferenciados: cliente · profesional · administrador
- API REST documentada

---

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | React + JavaScript |
| Backend | Java 17 + Spring Boot |
| Seguridad | Spring Security |
| ORM | Spring Data JPA + Hibernate |
| Base de datos | MySQL / MariaDB |
| Pagos | Stripe API |
| Mapas | Leaflet + OpenStreetMap |
| Build | Maven + Node.js |
| Despliegue | Render |
| Diseño / UML | Figma · Balsamiq · Draw.io |

---

## Arquitectura

```
┌──────────────────────────────────┐
│     Frontend React (puerto 3000) │
│  Búsqueda · Mapa · Reservas      │
│  Pagos Stripe · Panel usuario    │
└───────────────┬──────────────────┘
                │  REST API (JSON)
┌───────────────▼──────────────────┐
│  Spring Boot API (puerto 8080)   │
│  Auth · Usuarios · Servicios     │
│  Reservas · Valoraciones         │
└───────────────┬──────────────────┘
                │  JPA / Hibernate
┌───────────────▼──────────────────┐
│         MySQL Database           │
│         jobfree.sql              │
└──────────────────────────────────┘
```

---

## Estructura del repositorio

```
jobfree/
├── backend/       →  API REST con Spring Boot
├── frontend/      →  Aplicación React
└── database/      →  Schema SQL (jobfree.sql)
```

---

## Instalación local

**Requisitos:** Java 17, Maven, Node.js, MySQL

```bash
# Base de datos
mysql -u root -p jobfree < database/jobfree.sql

# Backend
cd backend
mvn spring-boot:run

# Frontend
cd frontend
npm install && npm start
```

---

## Equipo

| Desarrollador | GitHub |
|---|---|
| Daniel Nevado Merino | [@DaniGradoDaw](https://github.com/DaniGradoDaw) |
| Pablo Román Heredia | — |

---

## Autor

**Daniel** — Desarrollo de Aplicaciones Web (DAW)

[![GitHub](https://img.shields.io/badge/GitHub-DaniGradoDaw-181717?style=flat-square&logo=github)](https://github.com/DaniGradoDaw)
