import { useState } from "react";
import { Activity, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault(); setError("");
    if (!form.username.trim() || !form.password) { setError("Enter your username/email and password."); return; }
    setBusy(true);
    try { await login(form); navigate("/"); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  return <div className="auth-page"><div className="auth-card"><div className="brand auth-brand"><div className="brand-mark"><Activity size={21} /></div><span>Campus<span className="brand-accent">Flow</span></span></div><div className="eyebrow">WELCOME BACK</div><h1>Pick up your momentum.</h1><p className="page-subtitle">Sign in to your student command center.</p><form onSubmit={submit} className="auth-form"><div className="form-group"><label htmlFor="username">Username or email</label><input id="username" autoComplete="username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /></div><div className="form-group"><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>{error && <div className="inline-error">{error}</div>}<button className="button button-primary auth-submit" disabled={busy}>{busy ? "Signing in..." : <>Sign in <ArrowRight size={16} /></>}</button></form><p className="auth-switch">New to CampusFlow? <Link to="/register">Create an account</Link></p></div></div>;
}
