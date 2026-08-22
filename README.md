# ContractPulse CRM Enterprise (RevenueOps & B2B Contracts)

<div align="center">

![Java 21](https://img.shields.io/badge/Java-21%20LTS-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.3-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)

**An executive-grade, full-stack Revenue Operations (RevenueOps) and B2B Contract Lifecycle Management platform built with Spring Boot 3.3 (Java 21 Records & Virtual Threads) and React 19 (TypeScript, Tailwind CSS v4, Zustand, TanStack Table v8, and Recharts).**

[Live Interactive Demo](https://alxnrocha.github.io/java-crm/) • [Swagger OpenAPI Docs](http://localhost:8080/swagger-ui.html) • [Database Schema](server/src/main/resources/db/migration)

</div>

---

## 🏛️ System Architecture

```mermaid
graph TD
    subgraph Client ["Client (React 19 + TypeScript + Tailwind v4)"]
        UI[Executive Dashboard UI] --> Zustand[Zustand Stores: Contracts / Metrics / UI]
        Zustand --> API[Dual-Mode API Client]
        API -.->|Standalone / Pages| Mock[In-Memory Mock Data Engine]
        API -->|Production REST| Backend
    end

    subgraph Backend ["Server (Java 21 + Spring Boot 3.3.3)"]
        REST[REST Controllers + OpenAPI 3.0] --> Mappers[MapStruct Mappers]
        REST --> GlobalEx[RFC 7807 Global Exception Handler]
        Mappers --> Services[Business Service Layer]
        Services --> RevOps[RevenueOps Analytics Engine]
        Services --> FSM[Contract Lifecycle Finite State Machine]
        FSM --> Repos[Spring Data JPA Repositories]
    end

    subgraph Database ["PostgreSQL 17"]
        Repos --> Flyway[Flyway Migrations: Schema & Seed Data]
        Flyway --> Tables[(accounts / contacts / contracts / contract_amendments)]
    end
```

---

## ✨ Core Features & Capabilities

### 1. 📊 Executive RevenueOps Analytics Engine
- **Real-Time ARR & MRR Run-Rate**: Real-time aggregation of active contracts ($4,850,000 Total ARR / $404,166 Active MRR).
- **Target Attainment Pacing**: Visual goal attainment gauge (101% of $400k target).
- **90-Day Churn Risk Pipeline**: Proactive detection of contracts expiring within 90 days with dollar-value ARR at risk calculation ($580,000 at risk across 14 contracts).
- **Net Retention Rate (NRR)**: 114.8% net retention metric with historical YoY benchmark comparisons.
- **Interactive Spline Curve & Donut Distribution**: Recharts-powered annualized revenue pacing vs board targets and portfolio status breakdown (Active, In Review, Expiring Soon, Draft, Renewed).

### 2. 📑 High-Density TanStack Table Contracts Pipeline
- **Enterprise Multi-Filter & Search**: Instant debounce search across contract IDs, account titles, and owner names.
- **Status Pills**: Dynamic status filters (`All 127`, `Active 68`, `In Review 28`, `Expiring 14`, `Draft 9`, `Renewed 8`) with status dots.
- **Server/Client Pagination & Multi-Column Sorting**: High-performance pagination with custom page sizes.
- **Instant CSV Data Export**: One-click client-side CSV generator for executive reports.

### 3. 🔄 Interactive Contract Lifecycle Drawer & State Machine
- **Visual Horizontal Stepper**: `1. Draft` ➔ `2. Legal Review` ➔ `3. Active` ➔ `4. Renewal`.
- **Financial Cards**: Total Contract Value (ARR), Monthly Run Rate (MRR), Schedule Term, and Auto-Renewal clause indicator.
- **Key Stakeholders Directory**: Verified contact cards for Decision Makers, Legal Counsel, and Procurement with direct email/phone/LinkedIn links.
- **Immutable Amendments Timeline**: Vertical audit trail with delta values (`+$40k ARR`), effective dates, and author signatory stamps.
- **Quick Actions**: Document generation simulation (PDF/TXT) and instant state transitions.

### 4. ⚡ Instant Auto-Renewal Accelerator (`quickRenew`)
- Term duration selector (`6 Months`, `12 Months`, `24 Months`).
- Annual rate escalation slider (`0% Flat`, `+3%`, `+5%`, `+10%`).
- Instant ARR expansion preview and transition into renewed status.

### 5. ⌘ Universal Command Palette (`⌘K` / `Ctrl+K`)
- Global keyboard-first navigation and fuzzy search across contracts, accounts, and workspace actions.

---

## 🗄️ Database Schema & Domain Model

```mermaid
erDiagram
    ACCOUNTS ||--o{ CONTACTS : "has"
    ACCOUNTS ||--o{ CONTRACTS : "holds"
    CONTRACTS ||--o{ CONTRACT_AMENDMENTS : "contains"

    ACCOUNTS {
        uuid id PK
        varchar corporate_name
        varchar domain UK
        varchar logo_url
        varchar tax_id UK
        enum industry
        enum tier
        numeric annual_revenue
        enum status
        timestamp created_at
        timestamp updated_at
    }

    CONTACTS {
        uuid id PK
        uuid account_id FK
        varchar full_name
        varchar email
        varchar phone
        varchar job_title
        enum role_type
        varchar avatar_url
        varchar linkedin_url
        boolean primary_contact
        timestamp created_at
    }

    CONTRACTS {
        uuid id PK
        uuid account_id FK
        varchar contract_number UK
        varchar title
        numeric total_value
        numeric monthly_value
        enum billing_term
        date start_date
        date end_date
        enum status
        boolean auto_renew
        varchar owner_name
        varchar owner_avatar
        timestamp created_at
        timestamp updated_at
    }

    CONTRACT_AMENDMENTS {
        uuid id PK
        uuid contract_id FK
        varchar amendment_title
        numeric value_delta
        date effective_date
        varchar author_name
        text description
        timestamp created_at
    }
```

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- **Java 21 LTS** (`Eclipse Temurin 21`)
- **Apache Maven 3.9+**
- **Node.js 22+** and **npm**
- **Docker & Docker Compose** (optional for PostgreSQL)

### 1. Clone Repository
```bash
git clone https://github.com/alxnrocha/java-crm.git
cd java-crm
```

### 2. Run Database with Docker Compose
```bash
docker compose up -d
```
*PostgreSQL 17 will be available at `localhost:5432` with database `contractpulse_db`.*

### 3. Run Backend (Spring Boot 3.3.3)
```bash
cd server
mvn clean spring-boot:run
```
*Backend runs at `http://localhost:8080`.*
- **OpenAPI Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **API Base**: `http://localhost:8080/api/v1`

### 4. Run Frontend (React 19 + Vite)
```bash
cd client
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173` with instant mock engine fallback if backend is offline.*

### 5. Run All Tests
```bash
# Run Backend JUnit 5 Test Suite (14 tests)
cd server
mvn test

# Run Frontend Vitest & Testing Library Suite (15 tests)
cd client
npm test
```

---

## 🛠️ Technology Stack Breakdown

| Layer | Technologies | Key Highlights |
|---|---|---|
| **Backend** | Java 21 LTS, Spring Boot 3.3.3 | Records DTOs, MapStruct 1.5, Jakarta Validation, RFC 7807 ProblemDetail |
| **Data & Persistence** | PostgreSQL 17, Spring Data JPA, Hibernate, Flyway | UUID PKs, JPQL aggregations, B-Tree indexed Foreign Keys |
| **API & Docs** | Spring Web MVC, Springdoc OpenAPI 3.0 | Swagger UI interactive documentation, typed DTO endpoints |
| **Frontend** | React 19, TypeScript 5.8, Tailwind CSS v4 | CSS variables design tokens, responsive enterprise layout |
| **State & Tables** | Zustand 5.0, TanStack Table v8 | Reactive global state, multi-column sorting, pagination |
| **Visualization** | Recharts 2.15, Lucide React | Spline area charts, Donut distribution, SVG icons |
| **Testing** | JUnit 5, Mockito, Vitest, React Testing Library | 100% passing unit & integration test suites |
| **DevOps & CI/CD** | GitHub Actions, GitHub Pages, Docker Compose | Automated linting, test validation, and zero-config deployment |

---

<div align="center">
  <sub>Developed with pride by <a href="https://github.com/alxnrocha">Alex Rocha</a>. Designed for high-velocity enterprise B2B sales organizations.</sub>
</div>
