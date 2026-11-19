import axios from "axios";

export const endpoints = {
  tasks: import.meta.env.VITE_TASKS_ENDPOINT || "/api/tasks/",
  login: import.meta.env.VITE_LOGIN_ENDPOINT || "/api/auth/login/",
  register: import.meta.env.VITE_REGISTER_ENDPOINT || "/api/auth/register/",
  logout: import.meta.env.VITE_LOGOUT_ENDPOINT || "/api/auth/logout/"
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
  withCredentials: import.meta.env.VITE_WITH_CREDENTIALS === "true",
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("campusflow_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail
      || error.response?.data?.message
      || error.response?.data?.error
      || error.message
      || "Something went wrong while contacting the server.";
    return Promise.reject(new Error(message));
  }
);

export function normalizeTaskList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.tasks)) return payload.tasks;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

export function taskTitle(task) {
  return task.title || task.name || task.task_name || "Untitled task";
}

export function taskStatus(task) {
  return String(task.status || (task.completed ? "completed" : "pending")).toLowerCase().replaceAll(" ", "_");
}

export function taskDueDate(task) {
  return task.due_date || task.deadline || task.due || "";
}

export function getTaskId(task) {
  return task.id ?? task.pk;
}

export async function fetchTasks() {
  const response = await api.get(endpoints.tasks);
  return normalizeTaskList(response.data);
}

export async function fetchTask(id) {
  const response = await api.get(`${endpoints.tasks}${id}/`);
  return response.data;
}

export async function createTask(data) {
  const response = await api.post(endpoints.tasks, data);
  return response.data;
}

export async function updateTask(id, data) {
  const response = await api.patch(`${endpoints.tasks}${id}/`, data);
  return response.data;
}

export async function deleteTask(id) {
  await api.delete(`${endpoints.tasks}${id}/`);
}
