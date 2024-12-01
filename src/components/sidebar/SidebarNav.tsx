import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileBarChart2, User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function SidebarNav() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Tente novamente em alguns instantes."
      });
    }
  };

  return (
    <nav className="px-2 py-4 flex flex-col h-full">
      <div className="flex-1">
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
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md mt-2"
      >
        <LogOut className="h-4 w-4" />
        Sair
      </button>
    </nav>
  );
}