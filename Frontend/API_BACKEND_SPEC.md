# 🔗 API & DATABASE SPECIFICATION
## Especificações para Integração Backend - Frontend

### 📋 **OVERVIEW**
Este documento define todas as **rotas da API** e **estrutura de banco de dados** necessárias para integrar o frontend da **Plataforma Incubadora de Talentos** com o backend.

---

## 🗄️ **ESTRUTURA DO BANCO DE DADOS**

### **📊 Tabela: `participants`**
```sql
CREATE TABLE participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    photo_url TEXT,
    area VARCHAR(50) NOT NULL, -- 'Desenvolvimento', 'UX/UI Design', 'Quality Assurance', 'Data Science', 'Product Management', 'Marketing Digital'
    batch VARCHAR(50) NOT NULL, -- 'Turma 2024-1', 'Turma 2024-2', etc.
    status VARCHAR(20) NOT NULL DEFAULT 'Em Formação', -- 'Em Formação', 'Disponível', 'Reservado', 'Contratado'
    evolution INTEGER NOT NULL DEFAULT 0, -- 0-100
    start_date TIMESTAMP NOT NULL DEFAULT NOW(),
    bio TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices recomendados
CREATE INDEX idx_participants_area ON participants(area);
CREATE INDEX idx_participants_status ON participants(status);
CREATE INDEX idx_participants_batch ON participants(batch);
CREATE INDEX idx_participants_evolution ON participants(evolution);
```

### **👨‍💼 Tabela: `leaders`**
```sql
CREATE TABLE leaders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    photo_url TEXT,
    area VARCHAR(50) NOT NULL, -- Mesmas opções de participants.area
    department VARCHAR(100) NOT NULL,
    join_date TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_leaders_area ON leaders(area);
CREATE INDEX idx_leaders_department ON leaders(department);
```

### **📝 Tabela: `evaluations`**
```sql
CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    evaluator_id UUID NOT NULL REFERENCES leaders(id),
    evaluator_name VARCHAR(255) NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 10),
    feedback TEXT NOT NULL,
    category VARCHAR(30) NOT NULL, -- 'Técnica', 'Soft Skills', 'Liderança', 'Comunicação'
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_evaluations_participant_id ON evaluations(participant_id);
CREATE INDEX idx_evaluations_evaluator_id ON evaluations(evaluator_id);
CREATE INDEX idx_evaluations_category ON evaluations(category);
CREATE INDEX idx_evaluations_score ON evaluations(score);
```

### **📈 Tabela: `timeline_events`**
```sql
CREATE TABLE timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL, -- 'Inscrição', 'Avaliação', 'Interesse de Líder', 'Reserva', 'Formatura', 'Contratação'
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    actor_id UUID REFERENCES leaders(id), -- Opcional, para eventos com ator
    actor_name VARCHAR(255), -- Nome do ator no momento do evento
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_timeline_events_participant_id ON timeline_events(participant_id);
CREATE INDEX idx_timeline_events_type ON timeline_events(type);
CREATE INDEX idx_timeline_events_actor_id ON timeline_events(actor_id);
```

### **🔗 Tabela: `participant_skills` (Relacionamento N:N)**
```sql
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    area VARCHAR(50) NOT NULL, -- Relaciona com as áreas
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE participant_skills (
    participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (participant_id, skill_id)
);
```

### **❤️ Tabela: `leader_interests` (Interesses dos líderes)**
```sql
CREATE TABLE leader_interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    leader_id UUID NOT NULL REFERENCES leaders(id) ON DELETE CASCADE,
    participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'Interessado', -- 'Interessado', 'Reservado', 'Contratado', 'Cancelado'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(leader_id, participant_id)
);

CREATE INDEX idx_leader_interests_leader_id ON leader_interests(leader_id);
CREATE INDEX idx_leader_interests_participant_id ON leader_interests(participant_id);
CREATE INDEX idx_leader_interests_status ON leader_interests(status);
```

---

## 🛣️ **ROTAS DA API**

### **🏠 Base URL**
```
https://api.talent-incubator.com/v1
```

---

## 👥 **PARTICIPANTES**

### **📋 Listar Participantes**
```http
GET /participants
```

**Query Parameters:**
```typescript
{
  page?: number = 1,
  limit?: number = 50,
  search?: string, // Nome ou email
  area?: string, // Filtro por área
  status?: string, // Filtro por status
  batch?: string, // Filtro por turma
  sort?: string = 'name', // name, evolution, start_date
  order?: 'asc' | 'desc' = 'asc'
}
```

**Response:**
```typescript
{
  data: Participant[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  },
  filters: {
    areas: string[],
    statuses: string[],
    batches: string[]
  }
}
```

### **👤 Obter Participante por ID**
```http
GET /participants/:id
```

**Response:**
```typescript
{
  data: {
    id: string,
    name: string,
    email: string,
    phone: string,
    photo_url: string,
    area: string,
    batch: string,
    status: string,
    evolution: number,
    start_date: string,
    bio: string,
    skills: string[],
    evaluations: Evaluation[],
    timeline: TimelineEvent[]
  }
}
```

### **✏️ Atualizar Status do Participante**
```http
PATCH /participants/:id/status
```

**Body:**
```typescript
{
  status: 'Em Formação' | 'Disponível' | 'Reservado' | 'Contratado',
  leader_id?: string // Para mudanças feitas por líderes
}
```

### **📊 Atualizar Evolução**
```http
PATCH /participants/:id/evolution
```

**Body:**
```typescript
{
  evolution: number, // 0-100
  updated_by: string // ID do avaliador
}
```

---

## 👨‍💼 **LÍDERES**

### **📋 Listar Líderes**
```http
GET /leaders
```

**Query Parameters:**
```typescript
{
  page?: number = 1,
  limit?: number = 20,
  area?: string,
  department?: string
}
```

**Response:**
```typescript
{
  data: {
    id: string,
    name: string,
    email: string,
    photo_url: string,
    area: string,
    department: string,
    join_date: string,
    stats: {
      interested_count: number,
      reserved_count: number,
      hired_count: number
    }
  }[]
}
```

### **👤 Obter Líder por ID**
```http
GET /leaders/:id
```

### **❤️ Demonstrar Interesse**
```http
POST /leaders/:leaderId/interest
```

**Body:**
```typescript
{
  participant_id: string
}
```

### **📌 Reservar Participante**
```http
POST /leaders/:leaderId/reserve
```

**Body:**
```typescript
{
  participant_id: string,
  notes?: string
}
```

### **📋 Obter Interesses do Líder**
```http
GET /leaders/:id/interests
```

**Response:**
```typescript
{
  data: {
    id: string,
    participant: ParticipantSummary,
    status: string,
    created_at: string
  }[]
}
```

---

## 📝 **AVALIAÇÕES**

### **➕ Criar Avaliação**
```http
POST /evaluations
```

**Body:**
```typescript
{
  participant_id: string,
  evaluator_id: string,
  score: number, // 0-10
  feedback: string,
  category: 'Técnica' | 'Soft Skills' | 'Liderança' | 'Comunicação'
}
```

### **📋 Listar Avaliações de um Participante**
```http
GET /participants/:id/evaluations
```

**Query Parameters:**
```typescript
{
  category?: string,
  limit?: number = 10,
  offset?: number = 0
}
```

---

## 📈 **TIMELINE & EVENTOS**

### **📋 Obter Timeline do Participante**
```http
GET /participants/:id/timeline
```

**Response:**
```typescript
{
  data: {
    id: string,
    type: string,
    title: string,
    description: string,
    actor_name?: string,
    created_at: string
  }[]
}
```

### **➕ Adicionar Evento à Timeline**
```http
POST /participants/:id/timeline
```

**Body:**
```typescript
{
  type: string,
  title: string,
  description: string,
  actor_id?: string
}
```

---

## 📊 **DASHBOARD & ESTATÍSTICAS**

### **📈 Estatísticas Gerais**
```http
GET /dashboard/stats
```

**Response:**
```typescript
{
  data: {
    total_participants: number,
    available_participants: number,
    reserved_participants: number,
    hired_participants: number,
    average_evolution: number,
    active_leaders: number,
    total_evaluations: number,
    trends: {
      participants_growth: number,
      evolution_improvement: number,
      hiring_rate: number
    }
  }
}
```

### **📊 Distribuição por Status**
```http
GET /dashboard/status-distribution
```

**Response:**
```typescript
{
  data: {
    status: string,
    count: number,
    percentage: number
  }[]
}
```

### **📈 Distribuição por Área**
```http
GET /dashboard/area-distribution
```

**Response:**
```typescript
{
  data: {
    area: string,
    count: number,
    average_evolution: number
  }[]
}
```

### **📊 Evolução por Turma**
```http
GET /dashboard/evolution-by-batch
```

**Response:**
```typescript
{
  data: {
    batch: string,
    participant_count: number,
    average_evolution: number,
    completion_rate: number
  }[]
}
```

---

## 🎓 **ACADEMIA & TURMAS**

### **📋 Listar Turmas**
```http
GET /batches
```

**Response:**
```typescript
{
  data: {
    id: string,
    name: string,
    start_date: string,
    end_date: string,
    status: 'Em Andamento' | 'Concluída' | 'Planejada',
    participant_count: number,
    areas: string[],
    progress: number
  }[]
}
```

### **👤 Obter Detalhes da Turma**
```http
GET /batches/:id
```

### **📊 Módulos do Programa**
```http
GET /academy/modules
```

**Response:**
```typescript
{
  data: {
    id: string,
    name: string,
    description: string,
    duration_hours: number,
    completion_rate: number,
    status: string
  }[]
}
```

---

## 🔍 **BUSCA & FILTROS**

### **🔎 Busca Global**
```http
GET /search
```

**Query Parameters:**
```typescript
{
  q: string, // Termo de busca
  type?: 'participants' | 'leaders' | 'all',
  limit?: number = 20
}
```

**Response:**
```typescript
{
  data: {
    participants: ParticipantSummary[],
    leaders: LeaderSummary[]
  }
}
```

### **🏷️ Obter Filtros Disponíveis**
```http
GET /filters
```

**Response:**
```typescript
{
  data: {
    areas: string[],
    statuses: string[],
    batches: string[],
    departments: string[],
    skills: string[]
  }
}
```

---

## 🔐 **AUTENTICAÇÃO**

### **🔑 Login**
```http
POST /auth/login
```

**Body:**
```typescript
{
  email: string,
  password: string
}
```

**Response:**
```typescript
{
  data: {
    token: string,
    user: {
      id: string,
      name: string,
      email: string,
      role: 'admin' | 'leader' | 'evaluator',
      permissions: string[]
    }
  }
}
```

### **👤 Perfil do Usuário**
```http
GET /auth/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

---

## 📄 **TYPES TYPESCRIPT**

### **📝 Interface Participant**
```typescript
interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo_url: string;
  area: Area;
  batch: string;
  status: ParticipantStatus;
  evolution: number;
  start_date: string;
  bio: string;
  skills: string[];
  evaluations?: Evaluation[];
  timeline?: TimelineEvent[];
  created_at: string;
  updated_at: string;
}

enum Area {
  DEVELOPMENT = 'Desenvolvimento',
  UX_DESIGN = 'UX/UI Design',
  QA = 'Quality Assurance',
  DATA_SCIENCE = 'Data Science',
  PRODUCT = 'Product Management',
  MARKETING = 'Marketing Digital'
}

enum ParticipantStatus {
  IN_TRAINING = 'Em Formação',
  AVAILABLE = 'Disponível',
  RESERVED = 'Reservado',
  HIRED = 'Contratado'
}
```

### **👨‍💼 Interface Leader**
```typescript
interface Leader {
  id: string;
  name: string;
  email: string;
  photo_url: string;
  area: Area;
  department: string;
  join_date: string;
  stats: {
    interested_count: number;
    reserved_count: number;
    hired_count: number;
  };
  created_at: string;
  updated_at: string;
}
```

### **📝 Interface Evaluation**
```typescript
interface Evaluation {
  id: string;
  participant_id: string;
  evaluator_id: string;
  evaluator_name: string;
  score: number; // 0-10
  feedback: string;
  category: EvaluationCategory;
  created_at: string;
}

enum EvaluationCategory {
  TECHNICAL = 'Técnica',
  SOFT_SKILLS = 'Soft Skills',
  LEADERSHIP = 'Liderança',
  COMMUNICATION = 'Comunicação'
}
```

### **📈 Interface TimelineEvent**
```typescript
interface TimelineEvent {
  id: string;
  participant_id: string;
  type: TimelineEventType;
  title: string;
  description: string;
  actor_id?: string;
  actor_name?: string;
  created_at: string;
}

enum TimelineEventType {
  ENROLLMENT = 'Inscrição',
  EVALUATION = 'Avaliação',
  INTEREST = 'Interesse de Líder',
  RESERVATION = 'Reserva',
  GRADUATION = 'Formatura',
  HIRING = 'Contratação'
}
```

---

## ⚡ **ENDPOINTS DE AÇÃO RÁPIDA**

### **🔄 Ações em Lote**
```http
PATCH /participants/batch-update
```

**Body:**
```typescript
{
  participant_ids: string[],
  updates: {
    status?: ParticipantStatus,
    batch?: string,
    evolution?: number
  }
}
```

### **📊 Relatórios**
```http
GET /reports/participants
GET /reports/leaders
GET /reports/evaluations
```

**Query Parameters:**
```typescript
{
  format?: 'json' | 'csv' | 'xlsx',
  start_date?: string,
  end_date?: string,
  area?: string,
  batch?: string
}
```

---

## 🚀 **IMPLEMENTAÇÃO SUGERIDA**

### **🛠️ Stack Recomendada:**
- **Backend:** Node.js + Express/Fastify ou Python + FastAPI
- **Banco:** PostgreSQL + Redis (cache)
- **ORM:** Prisma/TypeORM ou SQLAlchemy
- **Auth:** JWT + bcrypt
- **Upload:** AWS S3/CloudFlare R2
- **Queue:** Redis Bull/Celery

### **🔧 Middlewares Necessários:**
- **CORS** configurado para frontend
- **Rate Limiting** (100 req/min)
- **Validation** (Joi/Yup/Pydantic)
- **Logging** (Winston/Python logging)
- **Error Handling** padronizado

### **📈 Considerações de Performance:**
- **Indexação** adequada no banco
- **Cache** em endpoints de dashboard
- **Paginação** em listas grandes
- **Eager loading** para relacionamentos
- **Compressão** gzip nas responses

---

## 📝 **NOTAS PARA DEV BACKEND**

1. **🔄 Sincronização:** Frontend já tem estrutura de tipos TypeScript compatível
2. **🎨 URLs de Imagem:** Usar CDN ou storage otimizado
3. **⚡ Real-time:** Considerar WebSockets para notificações
4. **🔐 Segurança:** Validação rigorosa de dados de entrada
5. **📊 Analytics:** Logs estruturados para métricas futuras
6. **🧪 Testes:** Cobertura mínima 80% nos endpoints críticos

**🎯 Esta especificação cobre 100% das necessidades do frontend atual e permite expansão futura!**