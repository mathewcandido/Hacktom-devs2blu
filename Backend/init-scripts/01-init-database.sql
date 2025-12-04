-- Script de inicialização do banco de dados
-- Este script será executado automaticamente quando o container MySQL for criado

USE talent_incubator;

-- Criar tabela de participantes
CREATE TABLE IF NOT EXISTS participants (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    photo_url TEXT,
    area VARCHAR(50) NOT NULL,
    batch VARCHAR(50) NOT NULL,
    status ENUM('Em Formação', 'Disponível', 'Reservado', 'Contratado') DEFAULT 'Em Formação',
    evolution INT DEFAULT 0,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_area (area),
    INDEX idx_batch (batch)
);

-- Criar tabela de líderes
CREATE TABLE IF NOT EXISTS leaders (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    photo_url TEXT,
    area VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_area (area),
    INDEX idx_department (department)
);

-- Criar tabela de avaliações
CREATE TABLE IF NOT EXISTS evaluations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    participant_id VARCHAR(36),
    evaluator_id VARCHAR(36),
    evaluator_name VARCHAR(255) NOT NULL,
    score INT CHECK (score >= 0 AND score <= 10),
    feedback TEXT NOT NULL,
    category ENUM('Técnica', 'Comportamental', 'Liderança', 'Comunicação') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
    FOREIGN KEY (evaluator_id) REFERENCES leaders(id) ON DELETE SET NULL,
    INDEX idx_participant (participant_id),
    INDEX idx_evaluator (evaluator_id),
    INDEX idx_category (category)
);

-- Criar tabela de eventos do timeline
CREATE TABLE IF NOT EXISTS timeline_events (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    participant_id VARCHAR(36),
    type ENUM('Avaliação', 'Reunião', 'Projeto', 'Feedback', 'Milestone') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    actor_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
    INDEX idx_participant (participant_id),
    INDEX idx_type (type)
);

-- Criar tabela de skills dos participantes
CREATE TABLE IF NOT EXISTS participant_skills (
    participant_id VARCHAR(36),
    skill_name VARCHAR(100),
    level ENUM('Iniciante', 'Intermediário', 'Avançado', 'Expert') DEFAULT 'Intermediário',
    PRIMARY KEY (participant_id, skill_name),
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
    INDEX idx_skill (skill_name)
);

-- Criar tabela de interesses dos líderes
CREATE TABLE IF NOT EXISTS leader_interests (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    leader_id VARCHAR(36),
    participant_id VARCHAR(36),
    status ENUM('Interesse', 'Reservado', 'Contratado', 'Rejeitado') DEFAULT 'Interesse',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (leader_id) REFERENCES leaders(id) ON DELETE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_leader_participant (leader_id, participant_id),
    INDEX idx_leader (leader_id),
    INDEX idx_participant (participant_id),
    INDEX idx_status (status)
);

-- Inserir dados de exemplo para participantes
INSERT INTO participants (name, email, phone, area, batch, status, evolution, bio) VALUES
('João Silva', 'joao.silva@example.com', '(11) 99999-1111', 'Desenvolvimento', 'Turma 2024-2', 'Disponível', 85, 'Desenvolvedor full-stack com experiência em React e Node.js'),
('Maria Santos', 'maria.santos@example.com', '(11) 99999-2222', 'UX/UI Design', 'Turma 2024-2', 'Em Formação', 70, 'Designer focada em experiência do usuário e interfaces intuitivas'),
('Pedro Costa', 'pedro.costa@example.com', '(11) 99999-3333', 'Quality Assurance', 'Turma 2024-1', 'Reservado', 90, 'QA Engineer especializado em automação de testes'),
('Ana Oliveira', 'ana.oliveira@example.com', '(11) 99999-4444', 'Desenvolvimento', 'Turma 2024-2', 'Disponível', 78, 'Desenvolvedora frontend especializada em React e TypeScript'),
('Carlos Ferreira', 'carlos.ferreira@example.com', '(11) 99999-5555', 'Data Science', 'Turma 2024-1', 'Contratado', 95, 'Cientista de dados com expertise em Python e Machine Learning'),
('Juliana Lima', 'juliana.lima@example.com', '(11) 99999-6666', 'UX/UI Design', 'Turma 2024-2', 'Disponível', 82, 'UX Designer com foco em design thinking e prototipagem'),
('Rafael Souza', 'rafael.souza@example.com', '(11) 99999-7777', 'DevOps', 'Turma 2024-1', 'Disponível', 88, 'DevOps Engineer especializado em AWS e containerização'),
('Fernanda Alves', 'fernanda.alves@example.com', '(11) 99999-8888', 'Quality Assurance', 'Turma 2024-2', 'Em Formação', 65, 'QA com foco em testes manuais e automatizados');

-- Inserir dados de exemplo para líderes
INSERT INTO leaders (name, email, area, department) VALUES
('Ana Silva', 'ana.silva@company.com', 'Desenvolvimento', 'Tecnologia'),
('Carlos Oliveira', 'carlos.oliveira@company.com', 'UX/UI Design', 'Produto'),
('Fernanda Lima', 'fernanda.lima@company.com', 'Quality Assurance', 'Qualidade'),
('Roberto Santos', 'roberto.santos@company.com', 'Data Science', 'Analytics'),
('Mariana Costa', 'mariana.costa@company.com', 'DevOps', 'Infraestrutura'),
('Paulo Rodrigues', 'paulo.rodrigues@company.com', 'Desenvolvimento', 'Tecnologia'),
('Lucia Martins', 'lucia.martins@company.com', 'UX/UI Design', 'Produto'),
('Diego Pereira', 'diego.pereira@company.com', 'Quality Assurance', 'Qualidade');

-- Inserir skills de exemplo
INSERT INTO participant_skills (participant_id, skill_name, level)
SELECT p.id, skill, level FROM participants p
CROSS JOIN (
    SELECT 'React' as skill, 'Avançado' as level UNION ALL
    SELECT 'Node.js', 'Intermediário' UNION ALL
    SELECT 'TypeScript', 'Avançado' UNION ALL
    SELECT 'JavaScript', 'Expert' UNION ALL
    SELECT 'HTML/CSS', 'Expert' UNION ALL
    SELECT 'Git', 'Avançado' UNION ALL
    SELECT 'Docker', 'Intermediário' UNION ALL
    SELECT 'AWS', 'Iniciante'
) skills
WHERE p.area = 'Desenvolvimento'
LIMIT 20;

INSERT INTO participant_skills (participant_id, skill_name, level)
SELECT p.id, skill, level FROM participants p
CROSS JOIN (
    SELECT 'Figma' as skill, 'Expert' as level UNION ALL
    SELECT 'Adobe XD', 'Avançado' UNION ALL
    SELECT 'Sketch', 'Intermediário' UNION ALL
    SELECT 'Photoshop', 'Avançado' UNION ALL
    SELECT 'Illustrator', 'Intermediário' UNION ALL
    SELECT 'Prototyping', 'Expert' UNION ALL
    SELECT 'User Research', 'Avançado'
) skills
WHERE p.area = 'UX/UI Design'
LIMIT 14;

-- Inserir avaliações de exemplo
INSERT INTO evaluations (participant_id, evaluator_id, evaluator_name, score, feedback, category)
SELECT
    p.id,
    l.id,
    l.name,
    FLOOR(6 + RAND() * 5), -- Score entre 6 e 10
    CONCAT('Avaliação detalhada do participante ', p.name, '. Demonstrou boa evolução em ', p.area),
    'Técnica'
FROM participants p
CROSS JOIN leaders l
WHERE RAND() < 0.3 -- 30% de chance de ter avaliação
LIMIT 15;

-- Inserir eventos do timeline
INSERT INTO timeline_events (participant_id, type, title, description, actor_name)
SELECT
    p.id,
    'Avaliação',
    'Avaliação Técnica Mensal',
    CONCAT('Avaliação técnica realizada para ', p.name, ' na área de ', p.area),
    l.name
FROM participants p
CROSS JOIN leaders l
WHERE RAND() < 0.4 -- 40% de chance
LIMIT 20;

INSERT INTO timeline_events (participant_id, type, title, description, actor_name)
SELECT
    p.id,
    'Projeto',
    'Entrega de Projeto',
    CONCAT('Projeto final entregue por ', p.name, ' com sucesso'),
    'Sistema'
FROM participants p
WHERE RAND() < 0.6 -- 60% de chance
LIMIT 12;

-- Inserir interesses dos líderes
INSERT INTO leader_interests (leader_id, participant_id, status, notes)
SELECT
    l.id,
    p.id,
    CASE
        WHEN RAND() < 0.3 THEN 'Interesse'
        WHEN RAND() < 0.6 THEN 'Reservado'
        ELSE 'Interesse'
    END,
    CONCAT('Interesse em ', p.name, ' para projeto na área de ', p.area)
FROM leaders l
CROSS JOIN participants p
WHERE l.area = p.area AND RAND() < 0.3 -- 30% de chance, mesma área
LIMIT 25;

-- Criar índices adicionais para performance
CREATE INDEX idx_participants_created_at ON participants(created_at);
CREATE INDEX idx_evaluations_created_at ON evaluations(created_at);
CREATE INDEX idx_timeline_created_at ON timeline_events(created_at);
CREATE INDEX idx_leader_interests_created_at ON leader_interests(created_at);

-- Criar view para estatísticas do dashboard
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
    COUNT(*) as total_participants,
    COUNT(CASE WHEN status = 'Disponível' THEN 1 END) as available_participants,
    COUNT(CASE WHEN status = 'Reservado' THEN 1 END) as reserved_participants,
    COUNT(CASE WHEN status = 'Contratado' THEN 1 END) as hired_participants,
    COUNT(CASE WHEN status = 'Em Formação' THEN 1 END) as in_training_participants,
    ROUND(AVG(evolution), 1) as average_evolution,
    (SELECT COUNT(*) FROM leaders) as active_leaders
FROM participants;