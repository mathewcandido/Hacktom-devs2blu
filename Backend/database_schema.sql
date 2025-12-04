# Database Schema SQL - Hacktom Devs2Blu

Este arquivo contém todas as tabelas SQL necessárias para implementar o backend baseado nos requisitos da API.

## 1. Criação do Banco de Dados

```sql
-- Criar banco de dados
CREATE DATABASE hacktom_devs2blu;
USE hacktom_devs2blu;
```

## 2. Tabelas de Enums/Lookup

```sql
-- Tabela de áreas
CREATE TABLE areas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#666666',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir áreas
INSERT INTO areas (name, display_name, color) VALUES
('DEVELOPMENT', 'Desenvolvimento', '#1976d2'),
('UX_DESIGN', 'UX/UI Design', '#7b1fa2'),
('QA', 'Quality Assurance', '#388e3c'),
('DATA_SCIENCE', 'Data Science', '#f57c00'),
('PRODUCT', 'Product Management', '#d32f2f'),
('MARKETING', 'Marketing Digital', '#0288d1');

-- Tabela de status dos participantes
CREATE TABLE participant_statuses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#666666',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir status
INSERT INTO participant_statuses (name, display_name, color) VALUES
('IN_TRAINING', 'Em Formação', '#ed6c02'),
('AVAILABLE', 'Disponível', '#2e7d32'),
('RESERVED', 'Reservado', '#1976d2'),
('HIRED', 'Contratado', '#9c27b0');

-- Tabela de categorias de avaliação
CREATE TABLE evaluation_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir categorias de avaliação
INSERT INTO evaluation_categories (name, display_name) VALUES
('TECHNICAL', 'Technical'),
('SOFT_SKILLS', 'Soft Skills'),
('COMMUNICATION', 'Communication'),
('PROBLEM_SOLVING', 'Problem Solving');

-- Tabela de tipos de timeline
CREATE TABLE timeline_event_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir tipos de timeline
INSERT INTO timeline_event_types (name, display_name) VALUES
('TRAINING', 'Training'),
('EVALUATION', 'Evaluation'),
('INTERVIEW', 'Interview'),
('HIRING', 'Hiring'),
('OTHER', 'Other');
```

## 3. Tabelas Principais

```sql
-- Tabela de usuários (para autenticação)
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'leader', 'participant') NOT NULL DEFAULT 'participant',
    photo VARCHAR(500),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Tabela de turmas/batches
CREATE TABLE batches (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    INDEX idx_active (is_active)
);

-- Inserir turmas exemplo
INSERT INTO batches (name, start_date, description) VALUES
('Turma 2024-1', '2024-01-15', 'Primeira turma de 2024'),
('Turma 2024-2', '2024-07-01', 'Segunda turma de 2024'),
('Turma 2023-2', '2023-07-01', 'Segunda turma de 2023'),
('Turma 2023-1', '2023-01-15', 'Primeira turma de 2023'),
('Turma 2022-2', '2022-07-01', 'Segunda turma de 2022');

-- Tabela de participantes
CREATE TABLE participants (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    area_id INT NOT NULL,
    status_id INT NOT NULL,
    batch_id VARCHAR(36) NOT NULL,
    bio TEXT,
    evolution DECIMAL(5,2) DEFAULT 0.00 CHECK (evolution >= 0 AND evolution <= 100),
    start_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (area_id) REFERENCES areas(id),
    FOREIGN KEY (status_id) REFERENCES participant_statuses(id),
    FOREIGN KEY (batch_id) REFERENCES batches(id),
    
    INDEX idx_user_id (user_id),
    INDEX idx_area_id (area_id),
    INDEX idx_status_id (status_id),
    INDEX idx_batch_id (batch_id),
    INDEX idx_evolution (evolution)
);

-- Tabela de skills dos participantes
CREATE TABLE participant_skills (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    participant_id VARCHAR(36) NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
    
    INDEX idx_participant_id (participant_id),
    INDEX idx_skill_name (skill_name)
);

-- Tabela de departamentos
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir departamentos exemplo
INSERT INTO departments (name, description) VALUES
('Tecnologia', 'Departamento de Tecnologia e Desenvolvimento'),
('Produto', 'Departamento de Gestão de Produtos'),
('Marketing', 'Departamento de Marketing e Comunicação'),
('Recursos Humanos', 'Departamento de Pessoas e Cultura'),
('Comercial', 'Departamento Comercial e Vendas');

-- Tabela de líderes
CREATE TABLE leaders (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    area VARCHAR(100) NOT NULL,
    department_id INT NOT NULL,
    join_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    
    INDEX idx_user_id (user_id),
    INDEX idx_area (area),
    INDEX idx_department_id (department_id)
);

-- Tabela de interesse dos líderes nos participantes
CREATE TABLE leader_participant_interests (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    leader_id VARCHAR(36) NOT NULL,
    participant_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (leader_id) REFERENCES leaders(id) ON DELETE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_interest (leader_id, participant_id),
    INDEX idx_leader_id (leader_id),
    INDEX idx_participant_id (participant_id)
);

-- Tabela de reservas dos líderes
CREATE TABLE leader_participant_reservations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    leader_id VARCHAR(36) NOT NULL,
    participant_id VARCHAR(36) NOT NULL,
    reserved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (leader_id) REFERENCES leaders(id) ON DELETE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
    
    INDEX idx_leader_id (leader_id),
    INDEX idx_participant_id (participant_id),
    INDEX idx_active (is_active)
);

-- Tabela de avaliações
CREATE TABLE evaluations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    participant_id VARCHAR(36) NOT NULL,
    evaluator_id VARCHAR(36) NOT NULL,
    category_id INT NOT NULL,
    score DECIMAL(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
    feedback TEXT,
    evaluation_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
    FOREIGN KEY (evaluator_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES evaluation_categories(id),
    
    INDEX idx_participant_id (participant_id),
    INDEX idx_evaluator_id (evaluator_id),
    INDEX idx_category_id (category_id),
    INDEX idx_evaluation_date (evaluation_date)
);

-- Tabela de timeline dos participantes
CREATE TABLE participant_timeline (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    participant_id VARCHAR(36) NOT NULL,
    event_type_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
    FOREIGN KEY (event_type_id) REFERENCES timeline_event_types(id),
    
    INDEX idx_participant_id (participant_id),
    INDEX idx_event_type_id (event_type_id),
    INDEX idx_event_date (event_date)
);
```

## 4. Tabelas Academy

```sql
-- Tabela de cursos
CREATE TABLE courses (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(100),
    level VARCHAR(50),
    instructor VARCHAR(255),
    status ENUM('active', 'completed', 'enrolling') DEFAULT 'enrolling',
    progress DECIMAL(5,2) DEFAULT 0.00 CHECK (progress >= 0 AND progress <= 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_instructor (instructor)
);

-- Tabela de tecnologias dos cursos
CREATE TABLE course_technologies (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    course_id VARCHAR(36) NOT NULL,
    technology VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    
    INDEX idx_course_id (course_id),
    INDEX idx_technology (technology)
);

-- Tabela de participantes nos cursos
CREATE TABLE course_participants (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    course_id VARCHAR(36) NOT NULL,
    participant_id VARCHAR(36) NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_enrollment (course_id, participant_id),
    INDEX idx_course_id (course_id),
    INDEX idx_participant_id (participant_id)
);

-- Tabela de eventos futuros
CREATE TABLE upcoming_events (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATETIME NOT NULL,
    duration VARCHAR(100),
    instructor VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_event_date (event_date),
    INDEX idx_instructor (instructor)
);

-- Tabela de recursos
CREATE TABLE resources (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    file_size VARCHAR(50),
    download_count INT DEFAULT 0,
    category VARCHAR(100),
    file_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_type (type),
    INDEX idx_category (category),
    INDEX idx_download_count (download_count)
);
```

## 5. Tabelas de Auditoria e Log

```sql
-- Tabela de sessões de usuário
CREATE TABLE user_sessions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_token_hash (token_hash),
    INDEX idx_expires_at (expires_at)
);

-- Tabela de logs de atividade
CREATE TABLE activity_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(36),
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_resource_type (resource_type),
    INDEX idx_created_at (created_at)
);
```

## 6. Views para Simplificar Consultas

```sql
-- View para participantes com informações completas
CREATE VIEW participant_details AS
SELECT 
    p.id,
    u.name,
    u.email,
    u.photo,
    u.phone,
    a.display_name as area,
    ps.display_name as status,
    b.name as batch,
    p.bio,
    p.evolution,
    p.start_date,
    p.created_at,
    p.updated_at
FROM participants p
JOIN users u ON p.user_id = u.id
JOIN areas a ON p.area_id = a.id
JOIN participant_statuses ps ON p.status_id = ps.id
JOIN batches b ON p.batch_id = b.id
WHERE u.is_active = TRUE;

-- View para líderes com informações completas
CREATE VIEW leader_details AS
SELECT 
    l.id,
    u.name,
    u.email,
    u.photo,
    l.area,
    d.name as department,
    l.join_date,
    l.created_at,
    l.updated_at
FROM leaders l
JOIN users u ON l.user_id = u.id
JOIN departments d ON l.department_id = d.id
WHERE u.is_active = TRUE;

-- View para estatísticas do dashboard
CREATE VIEW dashboard_stats AS
SELECT 
    COUNT(*) as total_participants,
    SUM(CASE WHEN ps.name = 'AVAILABLE' THEN 1 ELSE 0 END) as available_participants,
    SUM(CASE WHEN ps.name = 'RESERVED' THEN 1 ELSE 0 END) as reserved_participants,
    SUM(CASE WHEN ps.name = 'HIRED' THEN 1 ELSE 0 END) as hired_participants,
    AVG(p.evolution) as average_evolution
FROM participants p
JOIN participant_statuses ps ON p.status_id = ps.id
JOIN users u ON p.user_id = u.id
WHERE u.is_active = TRUE;
```

## 7. Procedures Úteis

```sql
-- Procedure para obter participantes com filtros
DELIMITER //
CREATE PROCEDURE GetFilteredParticipants(
    IN search_term VARCHAR(255),
    IN status_filter VARCHAR(50),
    IN area_filter VARCHAR(50),
    IN batch_filter VARCHAR(100),
    IN evolution_min DECIMAL(5,2),
    IN evolution_max DECIMAL(5,2),
    IN page_limit INT,
    IN page_offset INT
)
BEGIN
    SELECT 
        p.id,
        u.name,
        u.email,
        u.photo,
        u.phone,
        a.display_name as area,
        ps.display_name as status,
        b.name as batch,
        p.bio,
        p.evolution,
        p.start_date,
        p.created_at
    FROM participants p
    JOIN users u ON p.user_id = u.id
    JOIN areas a ON p.area_id = a.id
    JOIN participant_statuses ps ON p.status_id = ps.id
    JOIN batches b ON p.batch_id = b.id
    WHERE u.is_active = TRUE
        AND (search_term IS NULL OR 
             u.name LIKE CONCAT('%', search_term, '%') OR 
             u.email LIKE CONCAT('%', search_term, '%') OR
             a.display_name LIKE CONCAT('%', search_term, '%'))
        AND (status_filter IS NULL OR ps.display_name = status_filter)
        AND (area_filter IS NULL OR a.display_name = area_filter)
        AND (batch_filter IS NULL OR b.name = batch_filter)
        AND (evolution_min IS NULL OR p.evolution >= evolution_min)
        AND (evolution_max IS NULL OR p.evolution <= evolution_max)
    ORDER BY p.created_at DESC
    LIMIT page_limit OFFSET page_offset;
END //
DELIMITER ;
```

## 8. Índices para Performance

```sql
-- Índices compostos para melhor performance
CREATE INDEX idx_participants_area_status ON participants(area_id, status_id);
CREATE INDEX idx_participants_batch_evolution ON participants(batch_id, evolution);
CREATE INDEX idx_evaluations_participant_date ON evaluations(participant_id, evaluation_date);
CREATE INDEX idx_timeline_participant_date ON participant_timeline(participant_id, event_date);
CREATE INDEX idx_users_email_active ON users(email, is_active);
```

## 9. Triggers para Auditoria

```sql
-- Trigger para log de criação de participantes
DELIMITER //
CREATE TRIGGER participant_created_log
    AFTER INSERT ON participants
    FOR EACH ROW
BEGIN
    INSERT INTO activity_logs (user_id, action, resource_type, resource_id, details)
    VALUES (NEW.user_id, 'CREATE', 'participant', NEW.id, JSON_OBJECT('area_id', NEW.area_id, 'status_id', NEW.status_id));
END //
DELIMITER ;

-- Trigger para log de atualização de status
DELIMITER //
CREATE TRIGGER participant_status_updated_log
    AFTER UPDATE ON participants
    FOR EACH ROW
BEGIN
    IF OLD.status_id != NEW.status_id THEN
        INSERT INTO activity_logs (user_id, action, resource_type, resource_id, details)
        VALUES (NEW.user_id, 'UPDATE_STATUS', 'participant', NEW.id, 
                JSON_OBJECT('old_status_id', OLD.status_id, 'new_status_id', NEW.status_id));
    END IF;
END //
DELIMITER ;
```

## 10. Dados de Exemplo (Opcional)

```sql
-- Inserir usuário admin
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin', 'admin@hacktom.com', '$2b$10$hash_here', 'admin');

-- Inserir alguns participantes de exemplo
-- (Execute após ter usuários criados)
INSERT INTO participants (user_id, area_id, status_id, batch_id, evolution, start_date) 
SELECT u.id, 1, 1, b.id, 75.5, '2024-01-15'
FROM users u, batches b 
WHERE u.email = 'participante1@email.com' AND b.name = 'Turma 2024-1'
LIMIT 1;
```

Este schema SQL fornece uma base sólida para implementar todas as funcionalidades especificadas na API Requirements, com foco em performance, integridade dos dados e auditoria.