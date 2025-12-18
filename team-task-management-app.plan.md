# Team Task Management Application Plan

## Tech Stack

- **Frontend**: React with TypeScript, Vite for build tooling
- **Backend**: Node.js with Express.js
- **Database**: SQLite (simple, file-based, no separate server needed)
- **Styling**: CSS Modules or Tailwind CSS for modern UI

## Project Structure

```
/Users/motipi/work/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   └── FilterBar.tsx
│   │   ├── hooks/
│   │   │   └── useTasks.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── task.ts
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── tasks.ts
│   │   ├── models/
│   │   │   └── Task.ts
│   │   ├── database/
│   │   │   └── db.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Database Schema

**Tasks table:**

- `id` (INTEGER PRIMARY KEY)
- `title` (TEXT, NOT NULL)
- `description` (TEXT)
- `status` (TEXT: 'todo', 'in-progress', 'done')
- `assignee` (TEXT)
- `dueDate` (TEXT/DATETIME)
- `priority` (TEXT: 'low', 'medium', 'high')
- `createdAt` (DATETIME)
- `updatedAt` (DATETIME)

## API Endpoints

- `GET /api/tasks` - Get all tasks (with optional query params for filtering)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Frontend Features

1. **Task List View**

   - Display all tasks in a grid/list
   - Show task card with title, assignee, due date, priority badge, status
   - Click to view/edit details

2. **Task Form**

   - Create/Edit modal or page
   - Fields: title (required), description, assignee, due date, priority, status
   - Form validation

3. **Filtering & Sorting**

   - Filter by: status, assignee, priority
   - Sort by: due date, priority, created date

4. **Task Actions**

   - Mark as complete
   - Delete task
   - Quick status update

## Implementation Steps

1. Set up backend project with Express, TypeScript, SQLite
2. Create database schema and connection
3. Implement REST API endpoints with validation
4. Set up React frontend with Vite
5. Create TypeScript types for tasks
6. Build API service layer
7. Implement TaskList component
8. Implement TaskForm component
9. Add filtering and sorting functionality
10. Style with modern UI (cards, badges, forms)
11. Add error handling and loading states
12. Test end-to-end flow

## Key Files to Create

- `backend/src/server.ts` - Express server setup
- `backend/src/database/db.ts` - SQLite database initialization
- `backend/src/routes/tasks.ts` - Task CRUD routes
- `frontend/src/types/task.ts` - TypeScript task interface
- `frontend/src/services/api.ts` - API client functions
- `frontend/src/components/TaskList.tsx` - Main task display
- `frontend/src/components/TaskForm.tsx` - Create/edit form














