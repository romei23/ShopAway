INSERT INTO users (created_at, updated_at, name, email, password, user_type)
VALUES
(datetime('now'), datetime('now'), 'John Doe', 'john@example.com', '123456', 'shopper'),
(datetime('now'), datetime('now'), 'Admin User', 'admin@example.com', 'admin123', 'admin');
