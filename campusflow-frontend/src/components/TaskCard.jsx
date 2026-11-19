import { ArrowUpRight, CalendarDays, CheckCircle2, Circle, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { taskDueDate, taskStatus, taskTitle } from "../services/api";

function niceDate(value) {
  if (!value) return "No deadline";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function TaskCard({ task, onToggle }) {
  const status = taskStatus(task);
  const completed = ["completed", "done"].includes(status);
  const priority = String(task.priority || "medium").toLowerCase();
  return (
    <article className={`task-card ${completed ? "task-complete" : ""}`}>
      <button className="task-check" aria-label={completed ? "Mark pending" : "Mark completed"} onClick={() => onToggle(task, !completed)}>
        {completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
      </button>
      <div className="task-card-body">
        <Link to={`/tasks/${task.id ?? task.pk}`} className="task-title">{taskTitle(task)} <ArrowUpRight size={14} /></Link>
        <p>{task.description || "No description added."}</p>
        <div className="task-meta"><span><CalendarDays size={13} /> {niceDate(taskDueDate(task))}</span><span><Clock3 size={13} /> {status.replaceAll("_", " ")}</span></div>
      </div>
      <span className={`priority priority-${priority}`}>{priority}</span>
    </article>
  );
}
