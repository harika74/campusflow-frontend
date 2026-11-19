import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Activity, BarChart3, BookOpenCheck, CirclePlus, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/tasks", label: "Mission board", icon: BookOpenCheck },
  { to: "/analytics", label: "Analytics", icon: BarChart3 }
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="brand"><div className="brand-mark"><Activity size={21} /></div><span>Campus<span className="brand-accent">Flow</span></span></div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="nav-list">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={() => setOpen(false)}>
              <Icon size={18} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <NavLink to="/tasks/new" className="sidebar-create" onClick={() => setOpen(false)}><CirclePlus size={18} /> Create mission</NavLink>
        <div className="sidebar-bottom">
          <div className="avatar">{(user?.username || user?.email || "S").charAt(0).toUpperCase()}</div>
          <div className="user-meta"><strong>{user?.username || user?.email || "Student"}</strong><span>Student workspace</span></div>
          <button className="icon-button" title="Log out" onClick={handleLogout}><LogOut size={17} /></button>
        </div>
      </aside>
      {open && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setOpen(false)} />}
      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
          <div className="topbar-kicker">STUDENT COMMAND CENTER</div>
          <div className="topbar-right"><span className="status-dot" /> API-powered workspace</div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  );
}
