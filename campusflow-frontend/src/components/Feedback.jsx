import { AlertTriangle, RefreshCw } from "lucide-react";

export function ErrorMessage({ message, onRetry }) {
  return <div className="error-panel"><AlertTriangle size={20} /><div><strong>We couldn't load this data</strong><p>{message || "Please check your connection and try again."}</p></div>{onRetry && <button className="button button-secondary button-small" onClick={onRetry}><RefreshCw size={14} /> Retry</button>}</div>;
}

export function EmptyState({ title = "Nothing here yet", description = "Create your first task to get started." }) {
  return <div className="empty-state"><div className="empty-icon">✦</div><h3>{title}</h3><p>{description}</p></div>;
}
