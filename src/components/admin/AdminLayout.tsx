import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { useBranding } from "@/contexts/BrandingContext";
import { Badge } from "@/components/ui/badge";
import { Building2, User, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function AdminLayout() {
  const { branding, currentUser, currentEntity, currentRole, isLoading } = useBranding();
  const { signOut } = useAuth();

  const getEntityTypeLabel = (type: string) => {
    switch (type) {
      case 'root': return 'Platform';
      case 'distributor': return 'Distributor';
      case 'customer': return 'Customer';
      default: return type;
    }
  };

  const getEntityTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'root': return 'default';
      case 'distributor': return 'secondary';
      case 'customer': return 'outline';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b px-4" style={{ backgroundColor: branding?.brand_color || '#1e40af' }}>
            <div className="flex items-center gap-4">
              {branding && <img src={branding.logo} alt={branding.name} className="h-8 w-auto" />}
            </div>

            <div className="flex items-center gap-3">
              {/* Current Entity & Role Info */}
              {currentEntity && (
                <div className="flex items-center gap-2">
                  <Badge variant={getEntityTypeBadgeVariant(currentEntity.type)} className="bg-white/20 text-white border-white/30">
                    <Building2 className="h-3 w-3 mr-1" />
                    {getEntityTypeLabel(currentEntity.type)}
                  </Badge>
                  {currentRole && (
                    <Badge variant="outline" className="bg-white/10 text-white border-white/30">
                      {currentRole.name}
                    </Badge>
                  )}
                </div>
              )}

              {/* User Menu */}
              {currentUser && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <User className="h-4 w-4 mr-2" />
                      {currentUser.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>Current User</DropdownMenuLabel>
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      {currentUser.email}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </header>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
