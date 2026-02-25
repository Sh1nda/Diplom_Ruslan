-- ================================
--  Создание базы данных
-- ================================
CREATE DATABASE mtc_db
    WITH OWNER = mtc_user
    ENCODING 'UTF8'
    TEMPLATE template0;

\c mtc_db;

-- ================================
--  Таблица пользователей
-- ================================
CREATE TYPE user_role AS ENUM ('ADMIN', 'COMMANDER', 'TEACHER', 'CADET');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(64) UNIQUE NOT NULL,
    full_name VARCHAR(128) NOT NULL,
    hashed_password VARCHAR(256) NOT NULL,
    role user_role NOT NULL DEFAULT 'CADET',
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_users_username ON users(username);

-- ================================
--  Таблица учебных дисциплин
-- ================================
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(128) NOT NULL,
    description TEXT
);

-- ================================
--  Таблица расписания
-- ================================
CREATE TABLE schedule_items (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    group_name VARCHAR(64) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    room VARCHAR(64)
);

CREATE INDEX idx_schedule_group ON schedule_items(group_name);
CREATE INDEX idx_schedule_time ON schedule_items(start_time, end_time);

-- ================================
--  Таблица посещаемости
-- ================================
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    schedule_item_id INTEGER NOT NULL REFERENCES schedule_items(id) ON DELETE CASCADE,
    cadet_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    present BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_attendance_schedule ON attendance(schedule_item_id);
CREATE INDEX idx_attendance_cadet ON attendance(cadet_id);

-- ================================
--  Таблица дисциплинарных записей
-- ================================
CREATE TABLE discipline_records (
    id SERIAL PRIMARY KEY,
    cadet_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    commander_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    violation_type VARCHAR(128) NOT NULL,
    description TEXT,
    action_taken VARCHAR(128)
);

CREATE INDEX idx_discipline_cadet ON discipline_records(cadet_id);
CREATE INDEX idx_discipline_commander ON discipline_records(commander_id);

-- ================================
--  Таблица документов
-- ================================
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(128) NOT NULL,
    file_path VARCHAR(256) NOT NULL,
    category VARCHAR(64),
    uploaded_at TIMESTAMP NOT NULL DEFAULT NOW(),
    uploaded_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description TEXT
);

CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);

-- ================================
--  Начальные данные (опционально)
-- ================================
INSERT INTO users (username, full_name, hashed_password, role)
VALUES
('admin', 'Главный администратор', '$2b$12$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'ADMIN');
