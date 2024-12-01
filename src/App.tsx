import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Month from "./pages/Month";
import Login from "./pages/Login";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Subscription from "./pages/Subscription";
import Account from "./pages/Account";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider queryClient={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/month/:id"
              element={
                <ProtectedRoute>
                  <Month />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <div>Em breve</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;