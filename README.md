# The Ledger

A full-stack to-do application with a ledger/bookkeeping-inspired design — check off tasks and watch them get "stamped" done, just like closing an entry in a physical ledger book.

**Live demo:** https://fanciful-moxie-f327b4.netlify.app/

## Features

- Create, complete, and delete tasks
- Priority levels (low / medium / high), shown as ink-stamped tags
- Relational data model built for future growth: tasks can belong to projects, have subtasks (self-referencing), and support many-to-many tagging
- Custom-designed UI (not a template) — warm paper background, ruled rows, serif/mono type pairing, and an animated "done" stamp on task completion

## Tech Stack

**Frontend:** React (Vite), custom CSS
**Backend:** Node.js, Express
**Database:** PostgreSQL

## Architecture

```
React (client) → Express REST API (server) → PostgreSQL (todo_app_dev)
```

The client communicates with the API over HTTP (`fetch`); the API is the only layer that talks directly to the database, using parameterized queries via `node-postgres` (`pg`) to prevent SQL injection.

## Database Schema

- `users` — accounts
- `projects` — groups of tasks, owned by a user
- `todos` — the core task table; supports subtasks via a self-referencing `parent_id`
- `tags` — labels a user can create
- `todo_tags` — join table enabling many-to-many task ↔ tag relationships

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/todos` | Get all todos |
| GET | `/api/todos/:id` | Get a single todo |
| POST | `/api/todos` | Create a todo |
| PUT | `/api/todos/:id` | Update a todo (partial updates supported) |
| DELETE | `/api/todos/:id` | Delete a todo |

## Running Locally

**Prerequisites:** Node.js, PostgreSQL installed and running

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd todo-app

# 2. Set up the database
createdb todo_app_dev
psql todo_app_dev -f schema.sql

# 3. Set up the server
cd server
npm install
# create a .env file with:
#   PORT=5001
#   DATABASE_URL=postgresql://localhost:5432/todo_app_dev
npm run dev

# 4. Set up the client (in a new terminal)
cd ../client
npm install
npm run dev
```

The app will be running at `http://localhost:5173`, talking to the API at `http://localhost:5001`.

## Roadmap

- [ ] User authentication (signup/login)
- [ ] Deploy backend + database (Render + Neon) for a fully live demo
- [ ] Project and tag UI
- [ ] Subtask UI
- [ ] Due date sorting and filtering

## Author

Built by Amera Rammaha — [nejmatek.com](https://nejmatek.com)
