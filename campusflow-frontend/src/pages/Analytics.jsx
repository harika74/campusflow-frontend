import { useEffect, useMemo, useState } from "react";
import { Activity, CheckCircle2, Clock3, ListTodo } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Loading from "../components/Loading";
import { EmptyState, ErrorMessage } from "../components/Feedback";
import StatCard from "../components/StatCard";
import { fetchTasks, taskStatus } from "../services/api";

export default function Analytics() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() {
    setLoading(true); setError("");
    try { setTasks(await fetchTasks()); } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  const completed = tasks.filter(t => ["completed","done"].includes(taskStatus(t))).length;
  const pending = tasks.length - completed;
  const priorities = useMemo(() => ["high","medium","low"].map(priority => ({ name: priority[0].toUpperCase()+priority.slice(1), tasks: tasks.filter(t => String(t.priority || "medium").toLowerCase() === priority).length })), [tasks]);
  const pieData = [{ name: "Completed", value: completed }, { name: "Remaining", value: pending }];
  if (loading) return <Loading label="Calculating your performance..." />;
  return <div className="page-stack">
    <div className="page-heading-row"><div><div className="eyebrow"><Activity size={14} /> MEASURE YOUR MOMENTUM</div><h1>Performance analytics</h1><p className="page-subtitle">Insights calculated from your live CampusFlow tasks.</p></div></div>
    {error && <ErrorMessage message={error} onRetry={load} />}
    <section className="stats-grid"><StatCard label="Total missions" value={tasks.length} detail="Tasks fetched from API" icon={ListTodo} /><StatCard label="Completed" value={completed} detail="Finished missions" icon={CheckCircle2} tone="green" /><StatCard label="Remaining" value={pending} detail="Open missions" icon={Clock3} tone="amber" /><StatCard label="Completion" value={`${tasks.length ? Math.round(completed/tasks.length*100) : 0}%`} detail="Overall completion rate" icon={Activity} tone="violet" /></section>
    {tasks.length ? <section className="charts-grid"><div className="panel chart-panel"><div className="panel-heading"><div><span className="eyebrow">TASK DISTRIBUTION</span><h2>Completion overview</h2></div></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieData} dataKey="value" nameKey="name" innerRadius={66} outerRadius={100} paddingAngle={4}><Cell fill="#7c6cf2" /><Cell fill="#26324b" /></Pie><Tooltip contentStyle={{ background:"#111a2d", border:"1px solid #26324b", borderRadius:12, color:"#fff" }} /></PieChart></ResponsiveContainer><div className="chart-center"><strong>{tasks.length ? Math.round(completed/tasks.length*100) : 0}%</strong><span>complete</span></div></div><div className="chart-legend"><span><i className="legend-purple" /> Completed ({completed})</span><span><i className="legend-muted" /> Remaining ({pending})</span></div></div>
      <div className="panel chart-panel"><div className="panel-heading"><div><span className="eyebrow">PRIORITY MIX</span><h2>Missions by priority</h2></div></div><div className="bar-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={priorities} margin={{ top: 12, right: 10, left: -18, bottom: 0 }}><CartesianGrid stroke="#26324b" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" stroke="#8390a8" tickLine={false} axisLine={false} /><YAxis allowDecimals={false} stroke="#8390a8" tickLine={false} axisLine={false} /><Tooltip contentStyle={{ background:"#111a2d", border:"1px solid #26324b", borderRadius:12, color:"#fff" }} /><Bar dataKey="tasks" fill="#5b8def" radius={[7,7,0,0]} /></BarChart></ResponsiveContainer></div></div></section> : <EmptyState title="Analytics will appear here" description="Add tasks through the API to see your productivity breakdown." />}
  </div>;
}
