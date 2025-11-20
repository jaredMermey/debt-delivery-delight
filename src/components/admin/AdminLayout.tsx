import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { useBranding } from "@/contexts/BrandingContext";
import { Badge } from "@/components/ui/badge";
import { Building2, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { entityStore } from "@/lib/entityStore";

export function AdminLayout() {
  const { branding, currentUser, currentEntity, currentRole, switchUser } = useBranding();

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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b px-4" style={{ backgroundColor: branding.brandColor }}>
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-white" />
              <img src={branding.logo} alt={branding.name} className="h-8 w-auto" />
              <h1 className="ml-2 text-lg font-semibold text-white">
                {branding.name}
              </h1>
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

              {/* User Menu with Role Switcher (Dev Tool) */}
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
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                      Switch User (Dev Tool)
                    </DropdownMenuLabel>
                    {entityStore.getAllUsers().map((user) => {
                      const userEntity = entityStore.getEntity(user.entityId);
                      const userRole = entityStore.roles.get(user.roleId);
                      return (
                        <DropdownMenuItem
                          key={user.id}
                          onClick={() => switchUser(user.id)}
                          disabled={user.id === currentUser.id}
                        >
                          <div className="flex flex-col gap-1">
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {userEntity?.name} • {userRole?.name}
                            </div>
                          </div>
                        </DropdownMenuItem>
                      );
                    })}
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