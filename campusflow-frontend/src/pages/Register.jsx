import { useState } from "react";
import { Activity, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault(); setError("");
    if (form.username.trim().length < 3) { setError("Username must contain at least 3 characters."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError("Enter a valid email address."); return; }
    if (form.password.length < 8) { setError("Password must contain at least 8 characters."); return; }
    setBusy(true);
    try { await register(form); navigate("/login"); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  return <div className="auth-page"><div className="auth-card"><div className="brand auth-brand"><div className="brand-mark"><Activity size={21} /></div><span>Campus<span className="brand-accent">Flow</span></span></div><div className="eyebrow">START YOUR WORKSPACE</div><h1>Build your momentum.</h1><p className="page-subtitle">Create an account to organize your academic life.</p><form onSubmit={submit} className="auth-form"><div className="form-group"><label htmlFor="username">Username</label><input id="username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /></div><div className="form-group"><label htmlFor="email">Email</label><input id="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div><div className="form-group"><label htmlFor="password">Password</label><input id="password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>{error && <div className="inline-error">{error}</div>}<button className="button button-primary auth-submit" disabled={busy}>{busy ? "Creating account..." : <>Create account <ArrowRight size={16} /></>}</button></form><p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p></div></div>;
}
