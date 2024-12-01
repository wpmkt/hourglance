import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, BarChart2, LogOut } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-primary">TimeBank</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive("/")
                      ? "border-b-2 border-primary text-primary"
                      : "text-neutral-500 hover:text-neutral-700"
                  }`}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                <Link
                  to="/reports"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive("/reports")
                      ? "border-b-2 border-primary text-primary"
                      : "text-neutral-500 hover:text-neutral-700"
                  }`}
                >
                  <BarChart2 className="w-4 h-4 mr-2" />
                  Relatórios
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button className="p-2 rounded-md text-neutral-500 hover:text-neutral-700">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
};

export default Layout;