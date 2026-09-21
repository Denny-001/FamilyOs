
### 📄 `docs/architecture/data_flow.md`

```markdown
# FamilyOS — Data Flow

Sequence diagrams for the four flows that matter most: authentication, posting, contributing, and accessing a vault document.

---

## 1. Authentication (Login + Refresh Rotation)

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant C as Client (React)
    participant A as API (/auth)
    participant DB as MongoDB

    U->>C: enter phone + password
    C->>A: POST /auth/login
    A->>DB: find User by phone
    DB-->>A: user (incl. passwordHash)
    A->>A: bcrypt.compare(password, passwordHash)
    alt valid
        A->>A: sign access (15m) + refresh (30d)
        A-->>C: Set-Cookie: refreshToken (httpOnly)<br/>body: { user, accessToken }
        C->>C: store accessToken in memory (Zustand)
    else invalid
        A-->>C: 401 { success: false, error }
    end

    Note over C,A: 15 minutes later…

    C->>A: GET /families/:id/posts (expired token)
    A-->>C: 401
    C->>A: POST /auth/refresh (with cookie)
    A->>A: verify refresh signature + type
    A-->>C: new access token
    C->>A: retry original request
    A-->>C: 200 data