# API Requirements - Frontend Data Mapping

Este documento especifica exatamente quais dados o frontend precisa receber do backend para funcionar corretamente.

## 1. Endpoints Principais

### 1.1 Dashboard
**GET `/api/dashboard`**

```json
{
  "participants": [
    {
      "id": "string",
      "name": "string",
      "email": "string", 
      "area": "Desenvolvimento" | "UX/UI Design" | "Quality Assurance" | "Data Science" | "Product Management" | "Marketing Digital",
      "status": "Em Formação" | "Disponível" | "Reservado" | "Contratado",
      "evolution": "number (0-100)",
      "batch": "string",
      "startDate": "ISO 8601 date string",
      "photo": "string (URL)",
      "phone": "string",
      "bio": "string"
    }
  ],
  "leaders": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "area": "string",
      "department": "string",
      "photo": "string (URL)",
      "interestedParticipants": ["participant_id"],
      "reservedParticipants": ["participant_id"]
    }
  ],
  "stats": {
    "totalParticipants": "number",
    "availableParticipants": "number", 
    "reservedParticipants": "number",
    "hiredParticipants": "number",
    "averageEvolution": "number"
  }
}
```

### 1.2 Participantes
**GET `/api/participants`**

```json
[
  {
    "id": "string",
    "name": "string",
    "email": "string",
    "area": "Desenvolvimento" | "UX/UI Design" | "Quality Assurance" | "Data Science" | "Product Management" | "Marketing Digital",
    "status": "Em Formação" | "Disponível" | "Reservado" | "Contratado",
    "startDate": "ISO 8601 date string",
    "photo": "string (URL)",
    "phone": "string",
    "batch": "string",
    "bio": "string",
    "skills": ["string"],
    "evolution": "number (0-100)",
    "evaluations": [
      {
        "id": "string",
        "participantId": "string",
        "evaluatorId": "string",
        "evaluatorName": "string",
        "score": "number",
        "feedback": "string",
        "date": "ISO 8601 date string",
        "category": "Technical" | "Soft Skills" | "Communication" | "Problem Solving"
      }
    ],
    "timeline": [
      {
        "id": "string",
        "participantId": "string",
        "type": "Training" | "Evaluation" | "Interview" | "Hiring" | "Other",
        "title": "string",
        "description": "string",
        "date": "ISO 8601 date string"
      }
    ]
  }
]
```

**GET `/api/participants/:id`**

```json
{
  "id": "string",
  "name": "string", 
  "email": "string",
  "area": "Desenvolvimento" | "UX/UI Design" | "Quality Assurance" | "Data Science" | "Product Management" | "Marketing Digital",
  "status": "Em Formação" | "Disponível" | "Reservado" | "Contratado",
  "startDate": "ISO 8601 date string",
  "photo": "string (URL)",
  "phone": "string",
  "batch": "string",
  "bio": "string",
  "skills": ["string"],
  "evolution": "number (0-100)",
  "evaluations": [
    {
      "id": "string",
      "participantId": "string",
      "evaluatorId": "string",
      "evaluatorName": "string",
      "score": "number",
      "feedback": "string",
      "date": "ISO 8601 date string",
      "category": "Technical" | "Soft Skills" | "Communication" | "Problem Solving"
    }
  ],
  "timeline": [
    {
      "id": "string",
      "participantId": "string",
      "type": "Training" | "Evaluation" | "Interview" | "Hiring" | "Other",
      "title": "string",
      "description": "string",
      "date": "ISO 8601 date string"
    }
  ]
}
```

### 1.3 Líderes
**GET `/api/leaders`**

```json
[
  {
    "id": "string",
    "name": "string",
    "email": "string",
    "area": "string",
    "department": "string",
    "photo": "string (URL)",
    "joinDate": "ISO 8601 date string",
    "interestedParticipants": [
      {
        "id": "string",
        "name": "string",
        "area": "string",
        "evolution": "number"
      }
    ],
    "reservedParticipants": [
      {
        "id": "string", 
        "name": "string",
        "area": "string",
        "evolution": "number"
      }
    ]
  }
]
```

### 1.4 Academy
**GET `/api/academy`**

```json
{
  "courses": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "duration": "string",
      "level": "string",
      "participants": "number",
      "instructor": "string",
      "technologies": ["string"],
      "status": "active" | "completed" | "enrolling",
      "progress": "number (0-100) - opcional"
    }
  ],
  "upcomingEvents": [
    {
      "id": "string",
      "title": "string",
      "date": "ISO 8601 date string",
      "duration": "string",
      "instructor": "string",
      "description": "string"
    }
  ],
  "resources": [
    {
      "id": "string",
      "title": "string",
      "type": "string",
      "size": "string",
      "downloads": "number",
      "category": "string"
    }
  ],
  "stats": {
    "totalCourses": "number",
    "totalParticipants": "number",
    "activeCourses": "number",
    "upcomingEvents": "number"
  }
}
```

### 1.5 Autenticação
**POST `/api/auth/login`**

Request:
```json
{
  "email": "string",
  "password": "string"
}
```

Response:
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "admin" | "leader" | "participant"
  },
  "token": "string"
}
```

**POST `/api/auth/logout`**

Response:
```json
{
  "message": "Logout successful"
}
```

**GET `/api/auth/me`**

Response:
```json
{
  "id": "string",
  "name": "string", 
  "email": "string",
  "role": "admin" | "leader" | "participant"
}
```

## 2. Filtros e Queries

### 2.1 Participantes com Filtros
**GET `/api/participants?search={term}&status={status}&area={area}&batch={batch}&evolution_min={min}&evolution_max={max}`**

Parâmetros de query:
- `search`: string (opcional) - busca por nome, email ou área
- `status`: string (opcional) - "Em Formação" | "Disponível" | "Reservado" | "Contratado"
- `area`: string (opcional) - "Desenvolvimento" | "UX/UI Design" | "Quality Assurance" | "Data Science" | "Product Management" | "Marketing Digital"
- `batch`: string (opcional) - nome da turma
- `evolution_min`: number (opcional) - evolução mínima (0-100)
- `evolution_max`: number (opcional) - evolução máxima (0-100)

### 2.2 Líderes com Filtros
**GET `/api/leaders?search={term}&area={area}&department={department}&activity={activity}`**

Parâmetros de query:
- `search`: string (opcional) - busca por nome ou email
- `area`: string (opcional) - área de atuação
- `department`: string (opcional) - departamento
- `activity`: string (opcional) - "active" | "inactive"

## 3. Status Codes Esperados

- **200**: Sucesso
- **400**: Requisição inválida
- **401**: Não autorizado
- **403**: Proibido
- **404**: Não encontrado
- **500**: Erro interno do servidor

## 4. Headers Obrigatórios

### Request Headers:
```
Content-Type: application/json
Authorization: Bearer {token} (para endpoints protegidos)
```

### Response Headers:
```
Content-Type: application/json
```

## 5. Enums e Constantes

### Status dos Participantes:
- "Em Formação"
- "Disponível" 
- "Reservado"
- "Contratado"

### Áreas:
- "Desenvolvimento"
- "UX/UI Design"
- "Quality Assurance"
- "Data Science"
- "Product Management"
- "Marketing Digital"

### Categorias de Avaliação:
- "Technical"
- "Soft Skills"
- "Communication"
- "Problem Solving"

### Tipos de Timeline:
- "Training"
- "Evaluation"
- "Interview"
- "Hiring"
- "Other"

## 6. Validações Necessárias

### Participantes:
- `evolution`: deve estar entre 0 e 100
- `email`: formato de email válido
- `status`: deve ser um dos valores do enum
- `area`: deve ser um dos valores do enum

### Líderes:
- `email`: formato de email válido
- `interestedParticipants` e `reservedParticipants`: arrays de IDs válidos

### Datas:
- Todas as datas devem estar no formato ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)

## 7. Paginação (Recomendada)

Para endpoints que retornam listas grandes, implementar paginação:

```json
{
  "data": [...],
  "pagination": {
    "page": "number",
    "limit": "number", 
    "total": "number",
    "totalPages": "number"
  }
}
```

## 8. Error Response Format

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object (opcional)"
  }
}
```

## 9. Observações Importantes

1. **Datas**: Sempre usar formato ISO 8601
2. **IDs**: Usar strings (UUID recomendado)
3. **Imagens**: URLs públicas ou base64
4. **Performance**: Implementar cache para dashboard
5. **Segurança**: Sanitizar todos os inputs
6. **CORS**: Configurar adequadamente para o frontend
7. **Rate Limiting**: Implementar para proteção da API

Este documento serve como contrato entre frontend e backend, garantindo que todos os dados necessários sejam fornecidos no formato correto.