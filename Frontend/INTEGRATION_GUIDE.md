# ⚡ QUICK START GUIDE - BACKEND INTEGRATION

## 🎯 **RESUMO EXECUTIVO PARA DEV BACKEND**

Este guia resume **tudo que você precisa** para integrar o backend com o frontend da **Plataforma Incubadora de Talentos**.

---

## 🚀 **SETUP RÁPIDO (5 MINUTOS)**

### **1. Base URL da API**
```
http://localhost:8000/api/v1
```

### **2. Estrutura de Response Padrão**
```typescript
// Sucesso
{
  data: any,
  message?: string,
  pagination?: PaginationInfo
}

// Erro
{
  error: string,
  details?: any
}
```

### **3. Headers Obrigatórios**
```javascript
// CORS
Access-Control-Allow-Origin: http://localhost:3000, http://localhost:3001
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization

// Content-Type
Content-Type: application/json
```

---

## 📊 **ENDPOINTS CRÍTICOS (IMPLEMENTAR PRIMEIRO)**

### **🏠 Dashboard Stats**
```http
GET /api/v1/dashboard/stats
```
**Response mínima:**
```json
{
  "data": {
    "total_participants": 35,
    "available_participants": 12,
    "reserved_participants": 8,
    "hired_participants": 5,
    "average_evolution": 78.5,
    "active_leaders": 8
  }
}
```

### **👥 Lista de Participantes**
```http
GET /api/v1/participants?page=1&limit=50
```
**Response mínima:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@example.com", 
      "photo": "https://...",
      "area": "Desenvolvimento",
      "batch": "Turma 2024-2",
      "status": "Disponível",
      "evolution": 85,
      "startDate": "2024-08-01T00:00:00Z",
      "skills": ["React", "Node.js"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 35,
    "totalPages": 1
  }
}
```

### **👤 Detalhes do Participante**
```http
GET /api/v1/participants/:id
```
**Response mínima:**
```json
{
  "data": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "(11) 99999-9999",
    "photo": "https://...",
    "area": "Desenvolvimento", 
    "batch": "Turma 2024-2",
    "status": "Disponível",
    "evolution": 85,
    "startDate": "2024-08-01T00:00:00Z",
    "bio": "Desenvolvedor full-stack...",
    "skills": ["React", "Node.js", "TypeScript"],
    "evaluations": [
      {
        "id": "uuid",
        "score": 8,
        "feedback": "Excelente...",
        "category": "Técnica",
        "evaluatorName": "Ana Silva", 
        "date": "2024-11-01T00:00:00Z"
      }
    ],
    "timeline": [
      {
        "id": "uuid",
        "type": "Avaliação",
        "title": "Avaliação Técnica",
        "description": "Avaliação realizada...",
        "date": "2024-11-01T00:00:00Z",
        "actorName": "Ana Silva"
      }
    ]
  }
}
```

### **👨‍💼 Lista de Líderes**
```http
GET /api/v1/leaders
```
**Response mínima:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Ana Silva",
      "email": "ana@company.com",
      "photo": "https://...",
      "area": "Desenvolvimento",
      "department": "Tecnologia",
      "joinDate": "2023-01-01T00:00:00Z",
      "interestedParticipants": ["uuid1", "uuid2"],
      "reservedParticipants": ["uuid3"]
    }
  ]
}
```

---

## 📋 **BANCO DE DADOS ESSENCIAL**

### **🎯 Schema Mínimo (PostgreSQL)**

```sql
-- Participantes
CREATE TABLE participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    photo_url TEXT,
    area VARCHAR(50) NOT NULL, 
    batch VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'Em Formação',
    evolution INTEGER DEFAULT 0,
    start_date TIMESTAMP DEFAULT NOW(),
    bio TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Líderes  
CREATE TABLE leaders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    photo_url TEXT,
    area VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    join_date TIMESTAMP DEFAULT NOW()
);

-- Avaliações
CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID REFERENCES participants(id),
    evaluator_id UUID REFERENCES leaders(id),
    evaluator_name VARCHAR(255) NOT NULL,
    score INTEGER CHECK (score >= 0 AND score <= 10),
    feedback TEXT NOT NULL,
    category VARCHAR(30) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Timeline
CREATE TABLE timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID REFERENCES participants(id),
    type VARCHAR(30) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    actor_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Skills (Simples)
CREATE TABLE participant_skills (
    participant_id UUID REFERENCES participants(id),
    skill_name VARCHAR(100),
    PRIMARY KEY (participant_id, skill_name)
);
```

### **📝 Dados de Teste**
```sql
-- Inserir participantes de exemplo
INSERT INTO participants (name, email, area, batch, status, evolution, bio) VALUES
('João Silva', 'joao@example.com', 'Desenvolvimento', 'Turma 2024-2', 'Disponível', 85, 'Dev full-stack'),
('Maria Santos', 'maria@example.com', 'UX/UI Design', 'Turma 2024-2', 'Em Formação', 70, 'UX Designer'),
('Pedro Costa', 'pedro@example.com', 'Quality Assurance', 'Turma 2024-1', 'Reservado', 90, 'QA Engineer');

-- Inserir líderes
INSERT INTO leaders (name, email, area, department) VALUES
('Ana Silva', 'ana@company.com', 'Desenvolvimento', 'Tecnologia'),
('Carlos Oliveira', 'carlos@company.com', 'UX/UI Design', 'Produto'),
('Fernanda Lima', 'fernanda@company.com', 'Quality Assurance', 'Qualidade');

-- Skills
INSERT INTO participant_skills VALUES
('participant_id_1', 'React'),
('participant_id_1', 'Node.js'),
('participant_id_2', 'Figma'),
('participant_id_3', 'Selenium');
```

---

## 🔧 **IMPLEMENTAÇÃO MÍNIMA (NODE.JS)**

### **server.js**
```javascript
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001']
}));
app.use(express.json());

const pool = new Pool({
  connectionString: 'postgresql://user:password@localhost/talent_incubator'
});

// Dashboard Stats
app.get('/api/v1/dashboard/stats', async (req, res) => {
  const query = `
    SELECT 
      COUNT(*) as total_participants,
      COUNT(*) FILTER (WHERE status = 'Disponível') as available_participants,
      COUNT(*) FILTER (WHERE status = 'Reservado') as reserved_participants,
      COUNT(*) FILTER (WHERE status = 'Contratado') as hired_participants,
      ROUND(AVG(evolution), 1) as average_evolution
    FROM participants
  `;
  
  const result = await pool.query(query);
  const stats = result.rows[0];
  
  res.json({
    data: {
      total_participants: parseInt(stats.total_participants),
      available_participants: parseInt(stats.available_participants), 
      reserved_participants: parseInt(stats.reserved_participants),
      hired_participants: parseInt(stats.hired_participants),
      average_evolution: parseFloat(stats.average_evolution),
      active_leaders: 8 // Mock por enquanto
    }
  });
});

// Lista Participantes
app.get('/api/v1/participants', async (req, res) => {
  const query = `
    SELECT p.*, 
           ARRAY_AGG(ps.skill_name) FILTER (WHERE ps.skill_name IS NOT NULL) as skills
    FROM participants p
    LEFT JOIN participant_skills ps ON p.id = ps.participant_id
    GROUP BY p.id
    ORDER BY p.name
  `;
  
  const result = await pool.query(query);
  
  res.json({
    data: result.rows.map(p => ({
      ...p,
      photo: p.photo_url,
      startDate: p.start_date,
      skills: p.skills || []
    })),
    pagination: {
      page: 1,
      limit: 50,
      total: result.rows.length,
      totalPages: 1
    }
  });
});

// Detalhes Participante  
app.get('/api/v1/participants/:id', async (req, res) => {
  const { id } = req.params;
  
  // Participant
  const participantQuery = `
    SELECT p.*, ARRAY_AGG(ps.skill_name) as skills
    FROM participants p
    LEFT JOIN participant_skills ps ON p.id = ps.participant_id
    WHERE p.id = $1
    GROUP BY p.id
  `;
  
  // Evaluations
  const evaluationsQuery = `
    SELECT * FROM evaluations WHERE participant_id = $1 ORDER BY created_at DESC
  `;
  
  // Timeline
  const timelineQuery = `
    SELECT * FROM timeline_events WHERE participant_id = $1 ORDER BY created_at DESC
  `;
  
  const [pResult, eResult, tResult] = await Promise.all([
    pool.query(participantQuery, [id]),
    pool.query(evaluationsQuery, [id]),
    pool.query(timelineQuery, [id])
  ]);
  
  if (pResult.rows.length === 0) {
    return res.status(404).json({ error: 'Participant not found' });
  }
  
  const participant = pResult.rows[0];
  
  res.json({
    data: {
      ...participant,
      photo: participant.photo_url,
      startDate: participant.start_date,
      skills: participant.skills || [],
      evaluations: eResult.rows.map(e => ({
        ...e,
        date: e.created_at
      })),
      timeline: tResult.rows.map(t => ({
        ...t,
        date: t.created_at,
        actorName: t.actor_name
      }))
    }
  });
});

// Lista Líderes
app.get('/api/v1/leaders', async (req, res) => {
  const query = 'SELECT * FROM leaders ORDER BY name';
  const result = await pool.query(query);
  
  res.json({
    data: result.rows.map(leader => ({
      ...leader,
      photo: leader.photo_url,
      joinDate: leader.join_date,
      interestedParticipants: [], // Mock
      reservedParticipants: [] // Mock
    }))
  });
});

app.listen(8000, () => {
  console.log('🚀 API running on http://localhost:8000');
});
```

---

## 📋 **CHECKLIST DE IMPLEMENTAÇÃO**

### **🎯 Fase 1 - MVP (1-2 dias)**
- [ ] Configurar banco PostgreSQL
- [ ] Criar tabelas essenciais
- [ ] Inserir dados de teste
- [ ] Implementar GET /dashboard/stats
- [ ] Implementar GET /participants
- [ ] Implementar GET /participants/:id
- [ ] Implementar GET /leaders
- [ ] Configurar CORS

### **🚀 Fase 2 - Funcionalidades (2-3 dias)**
- [ ] POST /evaluations
- [ ] POST /leaders/:id/interest
- [ ] POST /leaders/:id/reserve
- [ ] PATCH /participants/:id/status
- [ ] GET /dashboard/status-distribution
- [ ] GET /dashboard/area-distribution
- [ ] Filtros e paginação

### **🔧 Fase 3 - Melhorias (1-2 dias)**
- [ ] Validações com Joi
- [ ] Tratamento de erros
- [ ] Logs estruturados
- [ ] Testes básicos
- [ ] Documentação Swagger

---

## ⚡ **COMANDOS ÚTEIS**

### **Testar API**
```bash
# Dashboard
curl http://localhost:8000/api/v1/dashboard/stats

# Participantes
curl http://localhost:8000/api/v1/participants

# Líder específico
curl http://localhost:8000/api/v1/participants/UUID_HERE
```

### **Verificar Frontend**
```bash
# No frontend, alterar API base URL
# src/services/api.ts
const API_BASE_URL = 'http://localhost:8000/api/v1';
```

---

## 🎯 **RESULTADO ESPERADO**

Após implementar essas rotas, o frontend irá:
- ✅ Carregar dashboard com dados reais
- ✅ Listar participantes do banco
- ✅ Mostrar detalhes completos
- ✅ Permitir filtros e busca
- ✅ Demonstrar interesse/reservar
- ✅ Exibir gráficos com dados reais

**🚀 Com este guia, você terá uma integração completa em 3-5 dias!**