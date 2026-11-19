import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, Pencil, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { ErrorMessage } from "../components/Feedback";
import { deleteTask, fetchTask, taskDueDate, taskStatus, taskTitle } from "../services/api";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() {
    setLoading(true); setError("");
    try { setTask(await fetchTask(id)); } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [id]);
  async function remove() {
    if (!window.confirm("Delete this mission permanently?")) return;
    try { await deleteTask(id); navigate("/tasks"); } catch (e) { setError(e.message); }
  }
  if (loading) return <Loading label="Opening mission..." />;
  if (!task) return <div className="page-stack"><ErrorMessage message={error || "Task not found."} onRetry={load} /><Link to="/tasks" className="text-link"><ArrowLeft size={15} /> Back to missions</Link></div>;
  return <div className="page-stack narrow-page">
    <Link to="/tasks" className="back-link"><ArrowLeft size={16} /> Back to mission board</Link>
    {error && <ErrorMessage message={error} />}
    <section className="panel detail-panel"><div className="detail-top"><span className={`priority priority-${String(task.priority || "medium").toLowerCase()}`}>{task.priority || "medium"} priority</span><span className="live-pill">{taskStatus(task).replaceAll("_"," ")}</span></div><h1>{taskTitle(task)}</h1><p className="detail-description">{task.description || "No description was provided for this mission."}</p><div className="detail-facts"><div><CalendarDays size={17} /><span><small>DEADLINE</small><strong>{taskDueDate(task) ? new Date(taskDueDate(task)).toLocaleDateString() : "Not set"}</strong></span></div><div><Clock3 size={17} /><span><small>STATUS</small><strong>{taskStatus(task).replaceAll("_"," ")}</strong></span></div></div><div className="detail-actions"><Link to={`/tasks/${id}/edit`} className="button button-primary"><Pencil size={16} /> Edit mission</Link><button className="button button-danger" onClick={remove}><Trash2 size={16} /> Delete</button></div></section>
  </div>;
}
