import { createContext, useContext, ReactNode } from 'react';
import { Entity, User, UserRole } from '@/types/campaign';
import { useCurrentUserEntity, useCurrentUser, useCurrentUserRole, useHasPermission } from '@/hooks/useEntities';

interface BrandingContextType {
  branding: Entity | null;
  currentUser: User | null;
  currentEntity: Entity | null;
  currentRole: UserRole | null;
  hasPermission: (permission: string) => boolean;
  isLoading: boolean;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export function BrandingProvider({ children }: { children: ReactNode }) {
  const { data: currentEntity, isLoading: entityLoading } = useCurrentUserEntity();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const { data: currentRole, isLoading: roleLoading } = useCurrentUserRole();

  const hasPermission = (permission: string) => {
    // This will be called dynamically via the hook
    return false; // Placeholder, actual check done via useHasPermission hook
  };

  const isLoading = entityLoading || userLoading || roleLoading;

  return (
    <BrandingContext.Provider
      value={{
        branding: currentEntity,
        currentUser,
        currentEntity,
        currentRole,
        hasPermission,
        isLoading,
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
