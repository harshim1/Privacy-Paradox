CREATE DATABASE IF NOT EXISTS privacy_paradox_db;

USE privacy_paradox_db;

CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT,
    content TEXT,
    encrypted_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);