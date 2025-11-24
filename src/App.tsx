import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { CampaignWizard } from "./pages/admin/CampaignWizard";
import { CampaignPreview } from "./pages/admin/CampaignPreview";
import { CampaignReports } from "./components/admin/CampaignReports";
import { UserManagement } from "./pages/admin/UserManagement";
import { EntityManagement } from "./pages/admin/EntityManagement";
import { BrandingProvider } from "./contexts/BrandingContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrandingProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="campaigns" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="entities" element={<EntityManagement />} />
              <Route path="campaign/new" element={<CampaignWizard />} />
              <Route path="campaign/:campaignId/edit" element={<CampaignWizard />} />
              <Route path="campaign/:campaignId/reports" element={<CampaignReports />} />
              <Route path="preview/:campaignId" element={<CampaignPreview />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </BrandingProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
