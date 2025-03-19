CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255)
);

CREATE TABLE tasks (
    task_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATETIME,
    priority TINYINT NOT NULL DEFAULT 0,
    status TINYINT NOT NULL DEFAULT 0,
    user_id INTEGER NOT NULL
);

CREATE TABLE task_dependencies (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    task_id INTEGER NOT NULL,
    parent_task_id INTEGER NOT NULL,
    UNIQUE (task_id, parent_task_id)
);