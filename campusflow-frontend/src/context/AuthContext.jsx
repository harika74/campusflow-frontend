import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, endpoints } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("campusflow_token") || "");
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("campusflow_user") || "null"); }
    catch { return null; }
  });

  useEffect(() => {
    if (token) localStorage.setItem("campusflow_token", token);
    else localStorage.removeItem("campusflow_token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("campusflow_user", JSON.stringify(user));
    else localStorage.removeItem("campusflow_user");
  }, [user]);

  async function login(credentials) {
    const response = await api.post(endpoints.login, credentials);
    const data = response.data || {};
    const receivedToken = data.access || data.token || data.key || data.access_token;
    if (!receivedToken) {
      throw new Error("Login response did not include a token. Check your backend response format and update AuthContext.jsx if needed.");
    }
    setToken(receivedToken);
    setUser(data.user || data.profile || { username: credentials.username || credentials.email || "Student" });
    return data;
  }

  async function register(details) {
    const response = await api.post(endpoints.register, details);
    return response.data;
  }

  async function logout() {
    try { await api.post(endpoints.logout); } catch { /* Local logout still works if the API has no logout endpoint. */ }
    setToken("");
    setUser(null);
  }

  const value = useMemo(() => ({ token, user, login, register, logout }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
