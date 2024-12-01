import { Link } from "react-router-dom";
import { LayoutDashboard, FileBarChart2, User } from "lucide-react";

export function SidebarNav() {
  return (
    <nav className="px-2 py-4">
      <Link
        to="/"
        className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-900 hover:bg-neutral-100 rounded-md"
      >
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </Link>
      <Link
        to="/reports"
        className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-900 hover:bg-neutral-100 rounded-md"
      >
        <FileBarChart2 className="h-4 w-4" />
        Relatórios
      </Link>
      <Link
        to="/account"
        className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-900 hover:bg-neutral-100 rounded-md"
      >
        <User className="h-4 w-4" />
        Minha Conta
      </Link>
    </nav>
  );
}