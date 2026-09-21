# FamilyOS — System Architecture

## 1. Overview

FamilyOS is a **modular monolith** — one Express app, one MongoDB cluster, clean module boundaries inside. This is the right shape for a solo/small team: no distributed tracing, no service mesh, no cross-service auth. If a module ever needs independent scaling (most likely `contributions/payments`), it can be extracted into its own service without rewriting the rest.

```mermaid
graph TB
    subgraph Clients
        PWA[React PWA<br/>Android home-screen installable]
        Browser[Desktop Browser]
    end

    subgraph "Edge / Transport"
        HTTPS[HTTPS / REST]
        WS[WebSocket<br/>Socket.io]
    end

    subgraph "Application Tier"
        API[Express API<br/>Node 20 LTS]
        AUTH[auth module]
        FAM[families module]
        FEED[feed module]
        EVT[events module]
        TSK[tasks module]
        CON[contributions module]
        VLT[vault module]
        NOT[notifications module]
        CRON[node-cron jobs]
    end

    subgraph "Data & Integrations"
        MONGO[(MongoDB Atlas<br/>familyId-scoped docs)]
        CLOUD[Cloudinary<br/>media + vault files]
        MPESA[M-Pesa Aggregator<br/>IntaSend / PesaPal]
        EMAIL[Resend / SendGrid]
        PUSH[OneSignal / FCM]
    end

    PWA --> HTTPS
    PWA --> WS
    Browser --> HTTPS
    Browser --> WS

    HTTPS --> API
    WS --> API

    API --> AUTH
    API --> FAM
    API --> FEED
    API --> EVT
    API --> TSK
    API --> CON
    API --> VLT
    API --> NOT

    AUTH --> MONGO
    FAM --> MONGO
    FEED --> MONGO
    EVT --> MONGO
    TSK --> MONGO
    CON --> MONGO
    VLT --> MONGO
    NOT --> MONGO

    FEED --> CLOUD
    VLT --> CLOUD
    CON --> MPESA
    NOT --> EMAIL
    NOT --> PUSH

    CRON --> MONGO
    CRON --> PUSH
    CRON --> EMAIL