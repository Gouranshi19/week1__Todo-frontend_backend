CREATE DATABASE todo_app;

USE todo_app;

CREATE TABLE tasks(
    id INT PRIMARY KEY AUTO_INCREMENT,
    task VARCHAR(100),
    done BOOLEAN
);

INSERT INTO tasks(task, done)
VALUES ('Learn SQL Basics', false);

SELECT * FROM tasks;

UPDATE tasks
SET done = true
WHERE id = 1;

DELETE FROM tasks
WHERE id = 1;