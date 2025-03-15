-- Create a table for storing user data
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    user_type VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Insert some sample data for testing (optional)
INSERT INTO users (username, email, user_type, password)
VALUES ('admin', 'admin@example.com', 'police', 'admin@123');
VALUES ('sushmitha', 'sushmitha@example.com', 'public', 'sushmitha@123');
VALUES ('spoorthi', 'spoorthi@example.com', 'professional', 'spoorthi@123');
VALUES ('amith', 'amith@example.com', 'professional', 'amith@123');
VALUES ('srujan', 'srujan@example.com', 'public', 'srujan@123');



-- Set AUTO_INCREMENT value for the user table
ALTER TABLE users AUTO_INCREMENT = 1;
