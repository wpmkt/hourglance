import { Link } from "react-router-dom";

export function SidebarLogo() {
  return (
    <div className="px-6 py-4 border-b border-neutral-100">
      <Link to="/" className="text-lg font-semibold text-neutral-900">
        NoQap
      </Link>
    </div>
  );
}