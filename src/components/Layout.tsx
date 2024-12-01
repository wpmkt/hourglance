import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { FloatingShiftButton } from "./FloatingShiftButton";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-lg font-semibold text-neutral-900">
              Ponto
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col gap-4">
                  <Link
                    to="/"
                    className="text-lg font-medium text-neutral-900 hover:text-neutral-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/reports"
                    className="text-lg font-medium text-neutral-900 hover:text-neutral-600 transition-colors"
                  >
                    Relatórios
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
      <FloatingShiftButton />
    </div>
  );
};

export default Layout;