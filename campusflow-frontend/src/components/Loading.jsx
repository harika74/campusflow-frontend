export default function Loading({ label = "Loading your workspace..." }) {
  return <div className="state-panel"><div className="spinner" /><p>{label}</p></div>;
}
