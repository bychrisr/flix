# API Specification

## REST API Specification
```yaml
openapi: 3.1.0
info:
  title: Flix API
  version: 1.0.0
  description: API for admin operations and learner content consumption
servers:
  - url: https://api.flix.example.com
    description: Production
  - url: http://localhost:3001
    description: Local
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
security:
  - bearerAuth: []
paths:
  /health:
    get:
      summary: Service health
      responses:
        '200':
          description: OK
  /api/admin/login:
    post:
      summary: Admin authentication
  /api/events:
    get:
      summary: List events
    post:
      summary: Create event
  /api/events/{id}:
    get:
      summary: Get event
    put:
      summary: Update event
    delete:
      summary: Delete event
  /api/events/{eventId}/lessons:
    get:
      summary: List lessons for event
    post:
      summary: Create lesson for event
  /api/lessons/{id}:
    get:
      summary: Get lesson details
    put:
      summary: Update lesson
    delete:
      summary: Delete lesson
  /api/lessons/{id}/materials:
    get:
      summary: List lesson materials
    post:
      summary: Upload material
  /api/quizzes:
    post:
      summary: Create quiz
  /api/quizzes/{id}:
    get:
      summary: Get quiz
    put:
      summary: Update quiz
    delete:
      summary: Delete quiz
  /api/quizzes/{id}/submit:
    post:
      summary: Submit quiz responses and return score
  /api/public/events/{slug}:
    get:
      summary: Event payload (returns 403 when event is private and access is not validated)
  /api/events/{slug}/access:
    post:
      summary: Validate private event access credentials and create access session
  /api/public/lessons/{id}/access:
    get:
      summary: Evaluate event visibility access + release/expiry access for lesson
```
