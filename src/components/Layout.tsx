import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { FloatingShiftButton } from "./FloatingShiftButton";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex w-full bg-neutral-50">
      <main className="flex-1">
        <nav className="bg-white border-b border-neutral-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] p-0">
                  <div className="px-6 py-4 border-b border-neutral-100">
                    <Link to="/" className="text-lg font-semibold text-neutral-900">
                      NoQap
                    </Link>
                  </div>
                  <nav className="px-2 py-4">
                    <Link
                      to="/"
                      className="block px-4 py-2 text-sm text-neutral-900 hover:bg-neutral-100 rounded-md"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/reports"
                      className="block px-4 py-2 text-sm text-neutral-900 hover:bg-neutral-100 rounded-md"
                    >
                      Relatórios
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
              <Link to="/" className="text-lg font-semibold text-neutral-900">
                NoQap
              </Link>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </div>
        <FloatingShiftButton />
      </main>
    </div>
  );
};

export default Layout;