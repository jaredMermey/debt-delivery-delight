import { createContext, useContext, ReactNode } from 'react';
import { Entity, User, UserRole } from '@/types/campaign';
import { entityStore } from '@/lib/entityStore';

interface BrandingContextType {
  branding: Entity;
  currentUser: User | null;
  currentEntity: Entity | null;
  currentRole: UserRole | null;
  hasPermission: (permission: string) => boolean;
  switchUser: (userId: string) => void;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export function BrandingProvider({ children }: { children: ReactNode }) {
  const branding = entityStore.getCurrentBranding();
  const currentUser = entityStore.getCurrentUser();
  const currentEntity = entityStore.getCurrentUserEntity();
  const currentRole = entityStore.getCurrentUserRole();

  const hasPermission = (permission: string) => {
    return entityStore.hasPermission(permission);
  };

  const switchUser = (userId: string) => {
    entityStore.setCurrentUser(userId);
    // Force re-render by updating the window
    window.location.reload();
  };

  return (
    <BrandingContext.Provider
      value={{
        branding,
        currentUser,
        currentEntity,
        currentRole,
        hasPermission,
        switchUser,
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
}
