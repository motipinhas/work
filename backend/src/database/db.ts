import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../tasks.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tasks table
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'todo',
    assignee TEXT,
    dueDate TEXT,
    priority TEXT NOT NULL DEFAULT 'medium',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK(status IN ('todo', 'in-progress', 'done')),
    CHECK(priority IN ('low', 'medium', 'high'))
  )
`);

// Create trigger to update updatedAt timestamp
db.exec(`
  CREATE TRIGGER IF NOT EXISTS update_tasks_timestamp 
  AFTER UPDATE ON tasks
  BEGIN
    UPDATE tasks SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END
`);

export default db;












