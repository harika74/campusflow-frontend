# Match the frontend to your WA-2 API

Before running the app, compare these assumptions with your Django `urls.py` and serializers.

| Frontend operation | Default request |
|---|---|
| Load tasks | `GET /api/tasks/` |
| Create task | `POST /api/tasks/` |
| Read one task | `GET /api/tasks/{id}/` |
| Update task | `PATCH /api/tasks/{id}/` |
| Delete task | `DELETE /api/tasks/{id}/` |
| Login | `POST /api/auth/login/` |
| Register | `POST /api/auth/register/` |
| Logout | `POST /api/auth/logout/` |

Change the endpoint paths in `.env`.

Default create/update JSON:

```json
{
  "title": "Finish database assignment",
  "description": "Complete normalization questions",
  "priority": "medium",
  "due_date": "2026-11-25",
  "status": "pending"
}
```

If your serializer expects a different structure, edit the `payload` object in `src/pages/CreateTask.jsx`.

If your task API is not protected, the app can be tested without login by removing `<Protected>` from the main route in `src/App.jsx`. Only do this if it matches your assignment/backend design.

## CORS

If the browser reports a CORS error, configure Django to allow the Vite development origin `http://localhost:5173`. For `django-cors-headers`, add the package, middleware, and `CORS_ALLOWED_ORIGINS` in Django settings. Do not disable browser security.
