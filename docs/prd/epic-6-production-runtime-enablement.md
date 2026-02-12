# Epic 6 Production Runtime Enablement
Epic goal: Move from in-memory MVP baseline to persistent runtime foundation, ensuring data durability, reproducible setup, and contract-stable backend behavior for real application usage.

## Story 6.1 Database Schema, Migrations, and Seed Baseline
As a platform engineer,
I want a reproducible database schema and seed process,
so that local and shared environments start from a consistent persistent state.

### Acceptance Criteria
1. Database schema for events, lessons, materials, quizzes, and auth context is defined and versioned.
2. Migration commands can apply schema changes deterministically in a clean environment.
3. Seed process provides minimum runnable data set for admin and learner journeys.

## Story 6.2 Repository Layer and Persistence Contracts
As a backend engineer,
I want domain services to use repository interfaces,
so that persistence implementation can evolve without breaking API behavior.

### Acceptance Criteria
1. Repository contracts are defined for all core entities.
2. In-memory access logic is replaced by repository-backed service implementations.
3. Core service unit/integration tests validate behavior parity with previous API contracts.

## Story 6.3 API Adapter Switch to Persistent Storage
As a delivery team,
I want the API runtime to persist all write/read operations,
so that application data survives server restarts and supports real usage.

### Acceptance Criteria
1. Create/update/delete flows write to persistent storage for all core domains.
2. Public and admin read endpoints return data from persistent storage consistently.
3. Runtime configuration supports local and managed database profiles via environment variables.

## Story 6.4 Data Integrity and Regression Guardrails
As a product owner,
I want regression protection around persistence migration,
so that existing completed flows remain stable after storage refactor.

### Acceptance Criteria
1. Integration suite covers critical admin and learner journeys against persistent storage.
2. Data integrity checks validate key constraints/relationships in runtime.
3. Migration from previous baseline does not regress accepted API contracts.
