import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { ErrorMessage } from "../components/Feedback";
import { createTask, fetchTask, taskDueDate, taskStatus, taskTitle, updateTask } from "../services/api";

export default function CreateTask({ edit = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", priority: "medium", due_date: "", status: "pending" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(edit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!edit) return;
    fetchTask(id).then(task => setForm({
      title: taskTitle(task),
      description: task.description || "",
      priority: String(task.priority || "medium").toLowerCase(),
      due_date: taskDueDate(task) ? String(taskDueDate(task)).slice(0,10) : "",
      status: taskStatus(task)
    })).catch(e => setApiError(e.message)).finally(() => setLoading(false));
  }, [edit, id]);

  function validate() {
    const next = {};
    if (!form.title.trim()) next.title = "A mission title is required.";
    else if (form.title.trim().length < 3) next.title = "Use at least 3 characters.";
    if (form.description.length > 500) next.description = "Keep the description under 500 characters.";
    if (form.due_date && Number.isNaN(new Date(form.due_date).getTime())) next.due_date = "Enter a valid date.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(e) {
    e.preventDefault(); setApiError("");
    if (!validate()) return;
    setSaving(true);
    const payload = { ...form, title: form.title.trim(), description: form.description.trim() };
    try {
      if (edit) await updateTask(id, payload);
      else await createTask(payload);
      navigate("/tasks");
    } catch (e) { setApiError(e.message); }
    finally { setSaving(false); }
  }

  if (loading) return <Loading label="Loading mission details..." />;
  return <div className="page-stack narrow-page">
    <Link to={edit ? `/tasks/${id}` : "/tasks"} className="back-link"><ArrowLeft size={16} /> Back</Link>
    <div><div className="eyebrow">TURN INTENTION INTO ACTION</div><h1>{edit ? "Edit mission" : "Create a mission"}</h1><p className="page-subtitle">Give your next step a name, a deadline, and a direction.</p></div>
    {apiError && <ErrorMessage message={apiError} />}
    <form className="panel form-panel" onSubmit={submit} noValidate>
      <div className="form-group"><label htmlFor="title">Mission title <span>*</span></label><input id="title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Finish database assignment" />{errors.title && <small className="field-error">{errors.title}</small>}</div>
      <div className="form-group"><label htmlFor="description">Description</label><textarea id="description" rows="4" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What needs to be done?" />{errors.description && <small className="field-error">{errors.description}</small>}<small className="field-hint">{form.description.length}/500 characters</small></div>
      <div className="form-two-col"><div className="form-group"><label htmlFor="priority">Priority</label><select id="priority" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div><div className="form-group"><label htmlFor="due_date">Deadline</label><input id="due_date" type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} />{errors.due_date && <small className="field-error">{errors.due_date}</small>}</div></div>
      {edit && <div className="form-group"><label htmlFor="status">Status</label><select id="status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option value="pending">Pending</option><option value="in_progress">In progress</option><option value="completed">Completed</option></select></div>}
      <div className="form-footer"><span className="field-hint">* Required field</span><button className="button button-primary" disabled={saving}>{saving ? "Saving..." : <><Save size={16} /> {edit ? "Save changes" : "Create mission"}</>}</button></div>
    </form>
  </div>;
}
