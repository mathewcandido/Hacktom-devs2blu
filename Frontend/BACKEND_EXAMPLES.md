# 🚀 BACKEND IMPLEMENTATION EXAMPLES
## Exemplos Práticos de Implementação das Rotas

### 📋 **EXEMPLOS DE IMPLEMENTAÇÃO - NODE.JS + EXPRESS**

#### **🏗️ Setup Básico**
```javascript
// server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
});

// Routes
app.use('/api/v1/participants', require('./routes/participants'));
app.use('/api/v1/leaders', require('./routes/leaders'));
app.use('/api/v1/dashboard', require('./routes/dashboard'));

app.listen(8000, () => {
  console.log('🚀 Server running on port 8000');
});
```

---

## 👥 **ROTAS DE PARTICIPANTES**

### **📋 Listar Participantes**
```javascript
// routes/participants.js
const express = require('express');
const router = express.Router();

// GET /api/v1/participants
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search,
      area,
      status,
      batch,
      sort = 'name',
      order = 'asc'
    } = req.query;

    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    let whereClause = 'WHERE 1=1';
    const params = [];
    
    if (search) {
      params.push(`%${search}%`, `%${search}%`);
      whereClause += ` AND (name ILIKE $${params.length-1} OR email ILIKE $${params.length})`;
    }
    
    if (area) {
      params.push(area);
      whereClause += ` AND area = $${params.length}`;
    }
    
    if (status) {
      params.push(status);
      whereClause += ` AND status = $${params.length}`;
    }
    
    if (batch) {
      params.push(batch);
      whereClause += ` AND batch = $${params.length}`;
    }

    // Count query
    const countQuery = `SELECT COUNT(*) FROM participants ${whereClause}`;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    // Main query
    params.push(limit, offset);
    const query = `
      SELECT 
        p.*,
        COALESCE(
          json_agg(
            DISTINCT ps.name
          ) FILTER (WHERE ps.id IS NOT NULL),
          '[]'
        ) as skills
      FROM participants p
      LEFT JOIN participant_skills psk ON p.id = psk.participant_id
      LEFT JOIN skills ps ON psk.skill_id = ps.id
      ${whereClause}
      GROUP BY p.id
      ORDER BY ${sort} ${order}
      LIMIT $${params.length-1} OFFSET $${params.length}
    `;

    const result = await pool.query(query, params);
    
    // Get filter options
    const filtersQuery = `
      SELECT 
        array_agg(DISTINCT area) as areas,
        array_agg(DISTINCT status) as statuses,
        array_agg(DISTINCT batch) as batches
      FROM participants
    `;
    const filtersResult = await pool.query(filtersQuery);

    res.json({
      data: result.rows.map(participant => ({
        ...participant,
        photo: participant.photo_url,
        startDate: participant.start_date,
        skills: participant.skills || []
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      },
      filters: filtersResult.rows[0]
    });

  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### **👤 Obter Participante por ID**
```javascript
// GET /api/v1/participants/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get participant with skills
    const participantQuery = `
      SELECT 
        p.*,
        COALESCE(
          json_agg(
            DISTINCT ps.name
          ) FILTER (WHERE ps.id IS NOT NULL),
          '[]'
        ) as skills
      FROM participants p
      LEFT JOIN participant_skills psk ON p.id = psk.participant_id
      LEFT JOIN skills ps ON psk.skill_id = ps.id
      WHERE p.id = $1
      GROUP BY p.id
    `;

    const participantResult = await pool.query(participantQuery, [id]);
    
    if (participantResult.rows.length === 0) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    const participant = participantResult.rows[0];

    // Get evaluations
    const evaluationsQuery = `
      SELECT e.*, l.name as evaluator_name
      FROM evaluations e
      LEFT JOIN leaders l ON e.evaluator_id = l.id
      WHERE e.participant_id = $1
      ORDER BY e.created_at DESC
    `;
    const evaluationsResult = await pool.query(evaluationsQuery, [id]);

    // Get timeline events
    const timelineQuery = `
      SELECT *
      FROM timeline_events
      WHERE participant_id = $1
      ORDER BY created_at DESC
    `;
    const timelineResult = await pool.query(timelineQuery, [id]);

    res.json({
      data: {
        ...participant,
        photo: participant.photo_url,
        startDate: participant.start_date,
        skills: participant.skills || [],
        evaluations: evaluationsResult.rows.map(eval => ({
          ...eval,
          date: eval.created_at
        })),
        timeline: timelineResult.rows.map(event => ({
          ...event,
          date: event.created_at,
          actorName: event.actor_name
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching participant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

---

## 📊 **ROTAS DO DASHBOARD**

### **📈 Estatísticas Gerais**
```javascript
// routes/dashboard.js
const express = require('express');
const router = express.Router();

// GET /api/v1/dashboard/stats
router.get('/stats', async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        COUNT(*) as total_participants,
        COUNT(*) FILTER (WHERE status = 'Disponível') as available_participants,
        COUNT(*) FILTER (WHERE status = 'Reservado') as reserved_participants,
        COUNT(*) FILTER (WHERE status = 'Contratado') as hired_participants,
        ROUND(AVG(evolution)::numeric, 1) as average_evolution
      FROM participants
    `;

    const leadersQuery = `
      SELECT COUNT(DISTINCT l.id) as active_leaders
      FROM leaders l
      WHERE EXISTS (
        SELECT 1 FROM leader_interests li 
        WHERE li.leader_id = l.id 
        AND li.created_at > NOW() - INTERVAL '30 days'
      )
    `;

    const evaluationsQuery = `
      SELECT COUNT(*) as total_evaluations
      FROM evaluations
      WHERE created_at > NOW() - INTERVAL '30 days'
    `;

    const [statsResult, leadersResult, evaluationsResult] = await Promise.all([
      pool.query(statsQuery),
      pool.query(leadersQuery),
      pool.query(evaluationsQuery)
    ]);

    const stats = statsResult.rows[0];
    const leaders = leadersResult.rows[0];
    const evaluations = evaluationsResult.rows[0];

    // Calculate trends (mock for now - implement based on historical data)
    const trends = {
      participants_growth: 12.5,
      evolution_improvement: 8.3,
      hiring_rate: 15.2
    };

    res.json({
      data: {
        total_participants: parseInt(stats.total_participants),
        available_participants: parseInt(stats.available_participants),
        reserved_participants: parseInt(stats.reserved_participants),
        hired_participants: parseInt(stats.hired_participants),
        average_evolution: parseFloat(stats.average_evolution),
        active_leaders: parseInt(leaders.active_leaders),
        total_evaluations: parseInt(evaluations.total_evaluations),
        trends
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### **📊 Distribuições para Gráficos**
```javascript
// GET /api/v1/dashboard/status-distribution
router.get('/status-distribution', async (req, res) => {
  try {
    const query = `
      SELECT 
        status,
        COUNT(*) as count,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM participants)), 1) as percentage
      FROM participants
      GROUP BY status
      ORDER BY count DESC
    `;

    const result = await pool.query(query);

    res.json({
      data: result.rows.map(row => ({
        status: row.status,
        count: parseInt(row.count),
        percentage: parseFloat(row.percentage)
      }))
    });

  } catch (error) {
    console.error('Error fetching status distribution:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/dashboard/area-distribution
router.get('/area-distribution', async (req, res) => {
  try {
    const query = `
      SELECT 
        area,
        COUNT(*) as count,
        ROUND(AVG(evolution)::numeric, 1) as average_evolution
      FROM participants
      GROUP BY area
      ORDER BY count DESC
    `;

    const result = await pool.query(query);

    res.json({
      data: result.rows.map(row => ({
        area: row.area,
        count: parseInt(row.count),
        average_evolution: parseFloat(row.average_evolution)
      }))
    });

  } catch (error) {
    console.error('Error fetching area distribution:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

---

## 👨‍💼 **ROTAS DE LÍDERES**

### **❤️ Demonstrar Interesse**
```javascript
// routes/leaders.js
const express = require('express');
const router = express.Router();

// POST /api/v1/leaders/:leaderId/interest
router.post('/:leaderId/interest', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { leaderId } = req.params;
    const { participant_id } = req.body;

    // Verify leader and participant exist
    const leaderCheck = await client.query('SELECT id, name FROM leaders WHERE id = $1', [leaderId]);
    const participantCheck = await client.query('SELECT id, name FROM participants WHERE id = $1', [participant_id]);

    if (leaderCheck.rows.length === 0) {
      throw new Error('Leader not found');
    }
    
    if (participantCheck.rows.length === 0) {
      throw new Error('Participant not found');
    }

    // Insert interest (with conflict handling)
    await client.query(`
      INSERT INTO leader_interests (leader_id, participant_id, status)
      VALUES ($1, $2, 'Interessado')
      ON CONFLICT (leader_id, participant_id) 
      DO UPDATE SET 
        status = 'Interessado',
        updated_at = NOW()
    `, [leaderId, participant_id]);

    // Add timeline event
    await client.query(`
      INSERT INTO timeline_events (participant_id, type, title, description, actor_id, actor_name)
      VALUES ($1, 'Interesse de Líder', 'Líder demonstrou interesse', $2, $3, $4)
    `, [
      participant_id,
      `${leaderCheck.rows[0].name} demonstrou interesse no talento`,
      leaderId,
      leaderCheck.rows[0].name
    ]);

    await client.query('COMMIT');

    res.json({
      message: 'Interest registered successfully',
      data: {
        leader_id: leaderId,
        participant_id: participant_id,
        status: 'Interessado'
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error registering interest:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// POST /api/v1/leaders/:leaderId/reserve
router.post('/:leaderId/reserve', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { leaderId } = req.params;
    const { participant_id, notes } = req.body;

    // Update participant status
    await client.query(`
      UPDATE participants 
      SET status = 'Reservado', updated_at = NOW()
      WHERE id = $1
    `, [participant_id]);

    // Update or insert interest with reserved status
    await client.query(`
      INSERT INTO leader_interests (leader_id, participant_id, status)
      VALUES ($1, $2, 'Reservado')
      ON CONFLICT (leader_id, participant_id) 
      DO UPDATE SET 
        status = 'Reservado',
        updated_at = NOW()
    `, [leaderId, participant_id]);

    // Get leader name for timeline
    const leaderResult = await client.query('SELECT name FROM leaders WHERE id = $1', [leaderId]);

    // Add timeline event
    await client.query(`
      INSERT INTO timeline_events (participant_id, type, title, description, actor_id, actor_name)
      VALUES ($1, 'Reserva', 'Talento reservado', $2, $3, $4)
    `, [
      participant_id,
      `Participante reservado por ${leaderResult.rows[0].name}${notes ? `. Observações: ${notes}` : ''}`,
      leaderId,
      leaderResult.rows[0].name
    ]);

    await client.query('COMMIT');

    res.json({
      message: 'Participant reserved successfully',
      data: {
        leader_id: leaderId,
        participant_id: participant_id,
        status: 'Reservado'
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error reserving participant:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});
```

---

## 📝 **VALIDAÇÕES COM JOI**

```javascript
// validators/participants.js
const Joi = require('joi');

const participantSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/).optional(),
  area: Joi.string().valid(
    'Desenvolvimento',
    'UX/UI Design', 
    'Quality Assurance',
    'Data Science',
    'Product Management',
    'Marketing Digital'
  ).required(),
  batch: Joi.string().required(),
  status: Joi.string().valid(
    'Em Formação',
    'Disponível', 
    'Reservado',
    'Contratado'
  ).default('Em Formação'),
  evolution: Joi.number().min(0).max(100).default(0),
  bio: Joi.string().max(1000).optional()
});

const evaluationSchema = Joi.object({
  participant_id: Joi.string().uuid().required(),
  evaluator_id: Joi.string().uuid().required(),
  score: Joi.number().min(0).max(10).required(),
  feedback: Joi.string().min(10).max(1000).required(),
  category: Joi.string().valid(
    'Técnica',
    'Soft Skills',
    'Liderança',
    'Comunicação'
  ).required()
});

module.exports = {
  participantSchema,
  evaluationSchema
};
```

---

## 🔐 **MIDDLEWARE DE AUTENTICAÇÃO**

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const userResult = await pool.query('SELECT * FROM leaders WHERE id = $1', [decoded.id]);
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    req.user = userResult.rows[0];
    next();
    
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied.' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
```

---

## 🧪 **EXEMPLO DE TESTES**

```javascript
// tests/participants.test.js
const request = require('supertest');
const app = require('../server');

describe('Participants API', () => {
  let authToken;

  beforeAll(async () => {
    // Login and get token
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password123'
      });
    
    authToken = loginResponse.body.data.token;
  });

  describe('GET /api/v1/participants', () => {
    it('should return participants list', async () => {
      const response = await request(app)
        .get('/api/v1/participants')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.pagination).toBeDefined();
    });

    it('should filter by area', async () => {
      const response = await request(app)
        .get('/api/v1/participants?area=Desenvolvimento')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      response.body.data.forEach(participant => {
        expect(participant.area).toBe('Desenvolvimento');
      });
    });
  });

  describe('POST /api/v1/evaluations', () => {
    it('should create new evaluation', async () => {
      const participantResponse = await request(app)
        .get('/api/v1/participants')
        .set('Authorization', `Bearer ${authToken}`);

      const participant = participantResponse.body.data[0];

      const evaluationData = {
        participant_id: participant.id,
        evaluator_id: 'leader-uuid',
        score: 8,
        feedback: 'Excelente desempenho na avaliação técnica.',
        category: 'Técnica'
      };

      const response = await request(app)
        .post('/api/v1/evaluations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(evaluationData)
        .expect(201);

      expect(response.body.data.score).toBe(8);
      expect(response.body.data.category).toBe('Técnica');
    });
  });
});
```

---

## 📦 **PACKAGE.JSON SUGERIDO**

```json
{
  "name": "talent-incubator-api",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "migrate": "node scripts/migrate.js",
    "seed": "node scripts/seed.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "pg": "^8.8.0",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^8.5.1",
    "joi": "^17.6.0",
    "helmet": "^6.0.0",
    "express-rate-limit": "^6.6.0",
    "multer": "^1.4.5",
    "aws-sdk": "^2.1200.0",
    "redis": "^4.3.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.20",
    "jest": "^29.0.0",
    "supertest": "^6.2.0"
  }
}
```

---

## 🚀 **SCRIPTS DE MIGRAÇÃO**

```sql
-- migrations/001_initial_schema.sql
BEGIN;

-- Create participants table
CREATE TABLE participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    photo_url TEXT,
    area VARCHAR(50) NOT NULL,
    batch VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Em Formação',
    evolution INTEGER NOT NULL DEFAULT 0 CHECK (evolution >= 0 AND evolution <= 100),
    start_date TIMESTAMP NOT NULL DEFAULT NOW(),
    bio TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_participants_area ON participants(area);
CREATE INDEX idx_participants_status ON participants(status);
CREATE INDEX idx_participants_batch ON participants(batch);
CREATE INDEX idx_participants_email ON participants(email);

-- Insert sample data
INSERT INTO participants (name, email, area, batch, evolution, bio) VALUES
('João Silva', 'joao@example.com', 'Desenvolvimento', 'Turma 2024-2', 75, 'Desenvolvedor full-stack com experiência em React e Node.js'),
('Maria Santos', 'maria@example.com', 'UX/UI Design', 'Turma 2024-2', 85, 'Designer especializada em interfaces web e mobile'),
('Pedro Costa', 'pedro@example.com', 'Quality Assurance', 'Turma 2024-1', 90, 'QA Engineer com foco em automação de testes');

COMMIT;
```

**🎯 Com essas implementações, o backend estará 100% compatível com o frontend existente!**