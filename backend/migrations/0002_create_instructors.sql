CREATE TABLE instructors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    expertise VARCHAR(255) NOT NULL,
    bio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
