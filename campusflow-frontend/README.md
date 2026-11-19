# CampusFlow — Student Command Center

A responsive React + Vite frontend for the CampusFlow REST API. It includes a dashboard, mission board, task details, create/edit forms, authentication screens, and live analytics.

## Requirements

- Node.js 18 or newer (Node.js 20 LTS recommended)
- npm
- Your Django REST Framework backend running locally or hosted

## 1. Start the backend

Open the existing `CampusFlow-API` project in a separate terminal and start it using the command appropriate for your backend. For a typical Django project:

```bash
python manage.py runserver
```

Confirm the API home page and task endpoint are reachable. The frontend expects a task collection endpoint and detail endpoints.

## 2. Install frontend dependencies

Extract this ZIP. Open the extracted `campusflow-frontend` folder in VS Code.

In the VS Code terminal:

```bash
npm install
```

## 3. Configure the API

Copy `.env.example` and rename the copy to `.env`.

Default configuration:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_TASKS_ENDPOINT=/api/tasks/
VITE_LOGIN_ENDPOINT=/api/auth/login/
VITE_REGISTER_ENDPOINT=/api/auth/register/
VITE_LOGOUT_ENDPOINT=/api/auth/logout/
VITE_WITH_CREDENTIALS=false
```

**Important:** The exact endpoint paths and request field names depend on your WA-2 Django API. Open your backend `urls.py` and set the paths above to match it. For example, if your task route is `/tasks/`, set `VITE_TASKS_ENDPOINT=/tasks/`.

The frontend expects these task operations:
- `GET tasks endpoint` — return an array, or a paginated object containing `results`
- `POST tasks endpoint` — create a task
- `GET tasks endpoint/:id/` — retrieve one task
- `PATCH tasks endpoint/:id/` — update a task
- `DELETE tasks endpoint/:id/` — delete a task

The frontend accepts task identifiers named `id` or `pk`, titles named `title`, `name`, or `task_name`, and due dates named `due_date`, `deadline`, or `due`. It sends `title`, `description`, `priority`, `due_date`, and `status` for create/update. If your backend uses different field names or does not support priority/due date/status, update the payload in `src/pages/CreateTask.jsx` to match your serializer.

### Authentication compatibility

The login page sends `{ "username": "...", "password": "..." }`. The register page sends `{ "username": "...", "email": "...", "password": "..." }`.

The login response should include a token field named `access`, `token`, `key`, or `access_token`. The frontend currently sends a Bearer token in the Axios request interceptor. If your backend uses DRF TokenAuthentication, change the Authorization header in `src/services/api.js` to `Token ${token}` (and remove the Bearer assignment). If your API uses session authentication, set `VITE_WITH_CREDENTIALS=true` and configure Django CORS/CSRF correctly.

If your WA-2 API does not yet provide login/register endpoints, you can temporarily remove the `Protected` wrapper in `src/App.jsx` to test task pages, but do not submit an app that bypasses authentication if your assignment requires it.

## 4. Run the frontend

```bash
npm run dev
```

Open the local URL printed in the terminal, usually:

`http://localhost:5173`

Keep the backend terminal running separately.

## 5. Test the required features

1. Register/login using an account supported by your API.
2. Confirm the dashboard displays tasks returned by the backend.
3. Create a task and confirm it appears on the mission board.
4. Open a task detail page.
5. Edit and delete a task.
6. Try an empty title to verify client-side validation.
7. Stop the backend and refresh; the UI should show a visible error instead of a blank screen.
8. Resize the browser to check mobile layout.

## 6. Production build

```bash
npm run build
```

A successful build creates the `dist` folder.

## 7. Upload to GitHub

1. Create a new public GitHub repository named `campusflow-frontend`.
2. Open a terminal in this project folder.
3. Run:

```bash
git init
git add .
git commit -m "Build CampusFlow React frontend"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/campusflow-frontend.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. Do not upload `.env` or `node_modules`; `.gitignore` excludes them.

Submit the public repository URL, not the ZIP file URL, unless your instructor separately asks for the ZIP.

## Notes

- All dashboard and analytics numbers are calculated from API task data; there are no mock task arrays.
- The app includes loading, error, empty, and form validation states.
- This is a frontend starter configured for a conventional REST resource. Match the `.env` paths and payload field names to your actual WA-2 API before final submission.
