import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { FloatingShiftButton } from "./FloatingShiftButton";
import { SidebarLogo } from "./sidebar/SidebarLogo";
import { SidebarNav } from "./sidebar/SidebarNav";
import { Link } from "react-router-dom";

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
                  <SidebarLogo />
                  <SidebarNav />
                </SheetContent>
              </Sheet>
              <Link to="/" className="text-lg font-semibold text-neutral-900">
                NoQap
              </Link>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
        <FloatingShiftButton />
      </main>
    </div>
  );
};

export default Layout;