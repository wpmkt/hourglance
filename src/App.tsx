import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Month from "@/pages/Month";
import Subscription from "@/pages/Subscription";
import AdminPanel from "@/pages/Admin";
import Login from "@/pages/Login";
import ResetPassword from "@/pages/ResetPassword";
import Success from "@/pages/Success";
import Cancel from "@/pages/Cancel";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider queryClient={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/month/:date" element={<ProtectedRoute><Month /></ProtectedRoute>} />
            <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;