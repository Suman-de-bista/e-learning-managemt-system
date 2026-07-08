CREATE TABLE courses(
    id SERIAL PRIMARY KEY,
    instructor_id INTEGER NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    level VARCHAR(50) NOT NULL,
    duration_hours INT NOT NULL CHECK (duration_hours > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_courses_instructor_id ON courses(instructor_id);
