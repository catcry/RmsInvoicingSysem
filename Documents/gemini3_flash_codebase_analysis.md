# Legacy Settlement Backend - Codebase Analysis

This project is a Spring Boot web application designed to handle **telecommunication roaming billing settlements** (specifically reconciling inbound and outbound call/SMS roaming charges between different mobile operators using **TAP** - Transferred Account Procedure file data).

---

## 🛠️ Technology Stack
- **Framework**: Spring Boot 3.3.4
- **Language**: Java 17
- **Database**: PostgreSQL (Production) / H2 (Development & Testing)
- **ORM / JPA**: Hibernate with Spring Data JPA
- **Security**: Spring Security with stateless JWT-based authentication
- **API Documentation**: Springdoc OpenAPI (Swagger UI) & Spring REST Docs
- **Utility Libraries**: Lombok, Apache Commons CSV
- **Frontend Integration**: Serves a compiled React Single Page Application (SPA) directly from the `src/main/resources/static/` directory via `ReactAppController`.

---

## 📂 Codebase Directory Structure
```
Backend/
├── src/main/java/com/bonyan/settlement/
│   ├── SettlementApplication.java     # Application entry point
│   ├── config/                        # Security configs, JWT filters, Exception handlers
│   ├── controller/                    # REST API Controllers
│   ├── converter/                     # JPA converters (e.g. converting Yes/No Char to Boolean)
│   ├── entity/                        # Database entities (BaseEntity, Operators, Statements, Aggregations)
│   ├── enumeration/                   # Enums (StreamType, TapFileType, ExcludeIncludeType)
│   ├── record/                        # DTOs implemented as Java 17 Records
│   ├── repository/                    # Spring Data JPA Repository interfaces & specifications
│   └── service/                       # Business logic services (Statement processing, CSV parsing, JWT token handling)
└── src/main/resources/
    ├── application.properties         # DB configurations, JWT secret, CORS configs
    ├── logback-spring.xml             # Logger configuration
    └── static/                        # Compiled React frontend static bundle (index.html, JS, CSS, images)
```

---

## 🏛️ Domain Model & Core Concepts

### 1. Carrier & Geographical Data
- **[OperatorEntity](file:///home/bobby/IdeaProjects/LegacySattelment/Backend/src/main/java/com/bonyan/settlement/entity/OperatorEntity.java)**: Represents mobile operators identified by their unique **TADIG** (Transferred Account Data Interchange Group) code (e.g., `IRN01`, `USA02`). It tracks roaming rates/counters for:
  - Calls made and received aboard
  - SMS messages made and received aboard
- **[CountryEntity](file:///home/bobby/IdeaProjects/LegacySattelment/Backend/src/main/java/com/bonyan/settlement/entity/CountryEntity.java)**: Stores country mappings.

### 2. TAP File Aggregations
- **[BaseAggregationEntity](file:///home/bobby/IdeaProjects/LegacySattelment/Backend/src/main/java/com/bonyan/settlement/entity/BaseAggregationEntity.java)**: Represents the parsed metadata and billing summaries from a single TAP/RAP file (standard file formats in GSM roaming). Key fields:
  - Sequence numbers (`tapSequenceNumber`, `rapSequenceNumber`)
  - Monetary values (`totalCharge`, `totalTaxValue`, `totalDiscountValue`, `exchangeRate`)
  - Call event details counter (`callEventDetailsCnt`)
  - Settlement flags (`isUsedForSettlement`)

### 3. Settlement Statements
- **[OutboundStatementEntity](file:///home/bobby/IdeaProjects/LegacySattelment/Backend/src/main/java/com/bonyan/settlement/entity/OutboundStatementEntity.java)**: An outbound billing statement summarizing our system's outbound traffic (which the other operator owes us) for a specific year and month, aggregated over several `BaseAggregationEntity` instances.
- **[InboundStatementEntity](file:///home/bobby/IdeaProjects/LegacySattelment/Backend/src/main/java/com/bonyan/settlement/entity/InboundStatementEntity.java)**: Represents the inbound invoice received from the partner operator (which we owe them).
- **[InOutStatementEntity](file:///home/bobby/IdeaProjects/LegacySattelment/Backend/src/main/java/com/bonyan/settlement/entity/InOutStatementEntity.java)**: Binds an outbound statement and an inbound statement together to perform **reconciliation** (discrepancy detection between outbound and inbound statements).
- **[NotAvailableSequenceEntity](file:///home/bobby/IdeaProjects/LegacySattelment/Backend/src/main/java/com/bonyan/settlement/entity/NotAvailableSequenceEntity.java)**: Sequence numbers of TAP files that are missing/gaps in sequences, which need to be excluded from settlement calculations.

---

## ⚡ Core Business & Reconciliation Logic

### 1. Verification of Ranges
In [InboundStatementEntity.java](file:///home/bobby/IdeaProjects/LegacySattelment/Backend/src/main/java/com/bonyan/settlement/entity/InboundStatementEntity.java) and [InboundStatementService.java](file:///home/bobby/IdeaProjects/LegacySattelment/Backend/src/main/java/com/bonyan/settlement/service/InboundStatementService.java), the system:
- Takes a starting sequence number (`seqFrom`) and ending sequence number (`seqTo`).
- Computes what sequence ranges are **included** or **excluded** from the invoice.
- Automatically handles sequence shifts and processes range splits (e.g. compressing list sequences like `00001, 00002, 00003` into `00001-00003`).

### 2. Discrepancy Calculation
When matching invoices, the system compares the invoice SDR/amount inside `InboundStatementEntity` against the amount calculated in `OutboundStatementEntity`:
$$\text{Difference Amount} = \text{Outbound Amount} - \text{Inbound Amount}$$
This difference represents billing deviations between the two operators that need review before being confirmed by an administrator.

---

## 🌐 API Endpoint Mapping

The REST APIs are secured using Bearer JWT tokens.

| Resource Endpoint | HTTP Method | Description | Security |
| :--- | :---: | :--- | :--- |
| **Authentication** | | | |
| `/login` | `POST` | Exchanges username & password for a stateless JWT token. | Public |
| **Settlement Management** | | | |
| `/api/settlements` | `GET` | Fetches all inbound statements. | `ADMIN`, `USER` |
| `/api/settlements/load/{id}` | `GET` | Loads details of a specific inbound statement. | `ADMIN`, `USER` |
| `/api/settlements/search` | `POST` | Searches/filters statements by operators, country, dates. | `ADMIN`, `USER` |
| `/api/settlements/create` | `POST` | Generates a new InOut statement reconciliation for a month. | `ADMIN`, `USER` |
| `/api/settlements/recreate` | `POST` | Re-runs the reconciliation/aggregation matching for a month. | `ADMIN`, `USER` |
| `/api/settlements/update-inbound` | `PUT` | Edits sequence ranges and amounts of an inbound invoice. | `ADMIN`, `USER` |
| `/api/settlements/confirm-statement` | `PUT` | Marks a reconciled statement invoice as confirmed. | `ADMIN`, `USER` |
| **TAP Aggregation** | | | |
| `/api/base-aggregation/outbound-aggregations` | `GET` | Loads list of detailed file aggregates in a statement. | Authenticated |
| `/api/base-aggregation/daily-report` | `GET` | Generates file volume and amount report grouped by day. | Authenticated |
| **Data Import** | | | |
| `/api/upload-csv` | `POST` | Uploads a CSV file containing partner operator inbound data. | Authenticated |
| **Operator & Country Setup** | | | |
| `/api/operators` | `GET` | Lists roaming operators. | Authenticated |
| `/api/countries` | `GET` | Lists country codes. | Authenticated |

---

## 🗄️ Database Schema Representation

Based on the entities, the PostgreSQL database contains the following tables:
- **`se_operator`**: Maps operators with their TADIG codes and voice/SMS tariff parameters.
- **`se_country`**: Country master list.
- **`se_base_agr`**: Holds raw aggregations from telecom files.
- **`se_ob_stmnt`**: Holds consolidated outbound statement details.
- **`se_ib_stmnt`**: Holds incoming invoices from partner operators.
- **`se_in_out_stmnt`**: Reconciles `se_ib_stmnt` and `se_ob_stmnt`.
- **`se_not_available_sequence`**: Tracks missing sequences/gaps.
- **`se_ib_stmnt_criteria`** / **`se_ob_stmnt_criteria`**: Lists specific sequence numbers to exclude/include.
- **`se_users`** / **`se_role`**: System user credentials and permission roles.
- **`se_international_outbounds_summary_view`**: Immutable database view summarizing pending vs closed amounts.
- **`se_profile_view`**: Immutable summary view of accounts.
