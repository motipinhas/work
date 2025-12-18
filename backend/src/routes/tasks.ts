import { Router, Request, Response } from 'express';
import db from '../database/db';
import { Task, CreateTaskInput, UpdateTaskInput, TaskStatus, TaskPriority } from '../models/Task';

const router = Router();

// Get all tasks with optional filtering
router.get('/', (req: Request, res: Response) => {
  try {
    const { status, assignee, priority, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params: any[] = [];

    if (status && ['todo', 'in-progress', 'done'].includes(status as string)) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (assignee) {
      query += ' AND assignee = ?';
      params.push(assignee);
    }

    if (priority && ['low', 'medium', 'high'].includes(priority as string)) {
      query += ' AND priority = ?';
      params.push(priority);
    }

    // Validate sortBy
    const validSortColumns = ['createdAt', 'updatedAt', 'dueDate', 'priority', 'title'];
    const sortColumn = validSortColumns.includes(sortBy as string) ? sortBy : 'createdAt';
    const order = sortOrder === 'asc' ? 'ASC' : 'DESC';

    query += ` ORDER BY ${sortColumn} ${order}`;

    const tasks = db.prepare(query).all(...params) as Task[];
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get single task
router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Task | undefined;

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// Create task
router.post('/', (req: Request, res: Response) => {
  try {
    const input: CreateTaskInput = req.body;

    if (!input.title || input.title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const status: TaskStatus = input.status || 'todo';
    const priority: TaskPriority = input.priority || 'medium';

    if (!['todo', 'in-progress', 'done'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    if (!['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority' });
    }

    const stmt = db.prepare(`
      INSERT INTO tasks (title, description, status, assignee, dueDate, priority)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      input.title.trim(),
      input.description?.trim() || null,
      status,
      input.assignee?.trim() || null,
      input.dueDate || null,
      priority
    );

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid) as Task;
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task
router.put('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Task | undefined;
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const input: UpdateTaskInput = req.body;

    if (input.title !== undefined && input.title.trim() === '') {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }

    if (input.status && !['todo', 'in-progress', 'done'].includes(input.status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    if (input.priority && !['low', 'medium', 'high'].includes(input.priority)) {
      return res.status(400).json({ error: 'Invalid priority' });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (input.title !== undefined) {
      updates.push('title = ?');
      values.push(input.title.trim());
    }
    if (input.description !== undefined) {
      updates.push('description = ?');
      values.push(input.description?.trim() || null);
    }
    if (input.status !== undefined) {
      updates.push('status = ?');
      values.push(input.status);
    }
    if (input.assignee !== undefined) {
      updates.push('assignee = ?');
      values.push(input.assignee?.trim() || null);
    }
    if (input.dueDate !== undefined) {
      updates.push('dueDate = ?');
      values.push(input.dueDate || null);
    }
    if (input.priority !== undefined) {
      updates.push('priority = ?');
      values.push(input.priority);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(query).run(...values);

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Task;
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Task | undefined;
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;












