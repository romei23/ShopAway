INSERT INTO users (created_at, updated_at, name, email, password, user_type)
VALUES (
  datetime('now'),
  datetime('now'),
  'New Admin',
  'myadmin@gmail.com',
  '$2b$10$i9aQckvyn7oLi4D2K7OqieRl7cYRDlq7/hAcNCuQZNjGpgtPTc15W',
  'admin'
);

