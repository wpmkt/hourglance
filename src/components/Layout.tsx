import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Calendar, BarChart2, LogOut, Menu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      localStorage.clear();
      navigate("/login", { replace: true });
      
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado da sua conta",
      });
    } catch (error: any) {
      console.error("Erro ao realizar logout:", error);
      localStorage.clear();
      navigate("/login", { replace: true });
      
      toast({
        title: "Aviso durante o logout",
        description: "Sessão finalizada localmente",
        variant: "destructive",
      });
    }
  };

  const NavLinks = () => (
    <>
      <Link
        to="/"
        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive("/")
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
            : "text-neutral-600 hover:bg-blue-50"
        }`}
      >
        <Calendar className="w-5 h-5 mr-3" />
        Dashboard
      </Link>
      <Link
        to="/reports"
        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive("/reports")
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
            : "text-neutral-600 hover:bg-blue-50"
        }`}
      >
        <BarChart2 className="w-5 h-5 mr-3" />
        Relatórios
      </Link>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white/80 backdrop-blur-lg border-b border-neutral-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-2 mt-6">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            TimeBank
          </span>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <aside className="w-64 bg-white/80 backdrop-blur-lg border-r border-neutral-200 fixed h-screen">
          <div className="flex flex-col h-full">
            <div className="p-6">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                TimeBank
              </span>
            </div>
            <nav className="flex-1 px-4 space-y-2">
              <NavLinks />
            </nav>
            <div className="p-4 border-t border-neutral-200">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sair
              </button>
            </div>
          </div>
        </aside>
        <div className="flex-1 ml-64">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="lg:hidden">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;