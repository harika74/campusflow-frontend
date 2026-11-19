import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, ListTodo, Plus, Sparkles, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchTasks, taskDueDate, taskStatus, taskTitle } from "../services/api";
import Loading from "../components/Loading";
import { EmptyState, ErrorMessage } from "../components/Feedback";
import StatCard from "../components/StatCard";
import TaskCard from "../components/TaskCard";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true); setError("");
    try { setTasks(await fetchTasks()); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  const completed = tasks.filter(t => ["completed", "done"].includes(taskStatus(t))).length;
  const pending = tasks.length - completed;
  const progress = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  const upcoming = useMemo(() => tasks.filter(t => !["completed", "done"].includes(taskStatus(t))).sort((a,b) => {
    const da = taskDueDate(a) ? new Date(taskDueDate(a)).getTime() : Infinity;
    const db = taskDueDate(b) ? new Date(taskDueDate(b)).getTime() : Infinity;
    return da - db;
  }).slice(0, 4), [tasks]);

  async function toggle(task, done) {
    const { updateTask } = await import("../services/api");
    try {
      await updateTask(task.id ?? task.pk, { status: done ? "completed" : "pending", completed: done });
      await load();
    } catch (e) { setError(e.message); }
  }

  if (loading) return <Loading />;
  return <div className="page-stack">
    <section className="welcome-row"><div><div className="eyebrow"><Sparkles size={14} /> YOUR SPACE TO MAKE PROGRESS</div><h1>Make today <span>count.</span></h1><p className="page-subtitle">A clear view of your work, priorities, and momentum.</p></div><Link to="/tasks/new" className="button button-primary"><Plus size={17} /> New mission</Link></section>
    {error && <ErrorMessage message={error} onRetry={load} />}
    <section className="stats-grid">
      <StatCard label="Total missions" value={tasks.length} detail="All tasks in your workspace" icon={ListTodo} />
      <StatCard label="Completed" value={completed} detail="Missions finished" icon={CheckCircle2} tone="green" />
      <StatCard label="In your queue" value={pending} detail="Still to make progress on" icon={Clock3} tone="amber" />
      <StatCard label="Completion rate" value={`${progress}%`} detail="Based on your live task data" icon={Target} tone="violet" />
    </section>
    <section className="content-grid">
      <div className="panel progress-panel"><div className="panel-heading"><div><span className="eyebrow">YOUR MOMENTUM</span><h2>Progress snapshot</h2></div><span className="live-pill">LIVE DATA</span></div><div className="progress-number">{progress}<small>%</small></div><div className="progress-track"><div style={{ width: `${progress}%` }} /></div><div className="progress-caption"><span>{completed} completed</span><span>{pending} remaining</span></div><div className="quote-box">“Small steps every day add up to big results.”</div></div>
      <div className="panel"><div className="panel-heading"><div><span className="eyebrow">NEXT UP</span><h2>Priority radar</h2></div><Link to="/tasks" className="text-link">View all <ArrowRight size={14} /></Link></div>
        {upcoming.length ? <div className="task-list compact">{upcoming.map(t => <TaskCard key={t.id ?? t.pk ?? taskTitle(t)} task={t} onToggle={toggle} />)}</div> : <EmptyState title="Clear skies ahead" description="No pending tasks. Add a mission when you're ready." />}
      </div>
    </section>
    <section className="panel"><div className="panel-heading"><div><span className="eyebrow">GET MOVING</span><h2>Choose your next action</h2></div></div><div className="action-grid"><Link to="/tasks/new" className="action-tile"><div className="action-symbol purple"><Plus /></div><strong>Capture a mission</strong><span>Get a task out of your head and into your plan.</span></Link><Link to="/tasks" className="action-tile"><div className="action-symbol cyan"><ListTodo /></div><strong>Review your board</strong><span>See what is pending and what is complete.</span></Link><Link to="/analytics" className="action-tile"><div className="action-symbol green"><Target /></div><strong>Check your momentum</strong><span>Understand your progress with live analytics.</span></Link></div></section>
  </div>;
}
