import { useEffect, useMemo, useState } from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import { EmptyState, ErrorMessage } from "../components/Feedback";
import TaskCard from "../components/TaskCard";
import { fetchTasks, taskStatus, taskTitle, updateTask } from "../services/api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  async function load() {
    setLoading(true); setError("");
    try { setTasks(await fetchTasks()); } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function toggle(task, done) {
    try { await updateTask(task.id ?? task.pk, { status: done ? "completed" : "pending", completed: done }); await load(); }
    catch (e) { setError(e.message); }
  }

  const visible = useMemo(() => tasks.filter(task => {
    const status = taskStatus(task);
    const matchesFilter = filter === "all" || (filter === "completed" ? ["completed","done"].includes(status) : !["completed","done"].includes(status));
    return matchesFilter && taskTitle(task).toLowerCase().includes(search.toLowerCase());
  }), [tasks, search, filter]);

  if (loading) return <Loading label="Loading mission board..." />;
  return <div className="page-stack">
    <section className="page-heading-row"><div><div className="eyebrow"><SlidersHorizontal size={14} /> ORGANIZE YOUR WORK</div><h1>Mission board</h1><p className="page-subtitle">Every big result starts with a mission.</p></div><Link to="/tasks/new" className="button button-primary"><Plus size={17} /> Create mission</Link></section>
    {error && <ErrorMessage message={error} onRetry={load} />}
    <div className="toolbar"><div className="search-box"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search missions..." /></div><select value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filter tasks"><option value="all">All missions</option><option value="pending">Pending</option><option value="completed">Completed</option></select></div>
    {visible.length ? <div className="task-list">{visible.map(t => <TaskCard key={t.id ?? t.pk ?? taskTitle(t)} task={t} onToggle={toggle} />)}</div> : <EmptyState title={tasks.length ? "No matching missions" : "Your board is ready"} description={tasks.length ? "Try another search or filter." : "Create your first mission to populate this board."} />}
  </div>;
}
