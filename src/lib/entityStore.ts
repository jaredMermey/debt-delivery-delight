import { Entity, User, UserRole, UserPermission } from "@/types/campaign";

// All available permissions
export const PERMISSIONS: UserPermission[] = [
  // Campaign permissions
  { id: 'campaigns.view', name: 'View Campaigns', description: 'View campaign list and details', category: 'campaigns' },
  { id: 'campaigns.create', name: 'Create Campaigns', description: 'Create new campaigns', category: 'campaigns' },
  { id: 'campaigns.edit', name: 'Edit Campaigns', description: 'Edit existing campaigns', category: 'campaigns' },
  { id: 'campaigns.delete', name: 'Delete Campaigns', description: 'Delete campaigns', category: 'campaigns' },
  { id: 'campaigns.send', name: 'Send Campaigns', description: 'Send campaigns to consumers', category: 'campaigns' },
  
  // User management permissions
  { id: 'users.view', name: 'View Users', description: 'View user list within entity', category: 'users' },
  { id: 'users.create', name: 'Create Users', description: 'Create new users', category: 'users' },
  { id: 'users.edit', name: 'Edit Users', description: 'Edit user details and roles', category: 'users' },
  { id: 'users.delete', name: 'Delete Users', description: 'Delete users', category: 'users' },
  
  // Report permissions
  { id: 'reports.view', name: 'View Reports', description: 'View campaign reports', category: 'reports' },
  { id: 'reports.export', name: 'Export Reports', description: 'Export report data', category: 'reports' },
  
  // Settings permissions
  { id: 'settings.view', name: 'View Settings', description: 'View entity settings', category: 'settings' },
  { id: 'settings.edit', name: 'Edit Settings', description: 'Edit entity settings and branding', category: 'settings' },
  
  // Entity management (Reliant and Distributor only)
  { id: 'entities.view', name: 'View Entities', description: 'View child entities (customers/distributors)', category: 'settings' },
  { id: 'entities.create', name: 'Create Entities', description: 'Create new child entities', category: 'settings' },
  { id: 'entities.edit', name: 'Edit Entities', description: 'Edit child entity details', category: 'settings' },
  { id: 'entities.delete', name: 'Delete Entities', description: 'Delete child entities', category: 'settings' },
];

class EntityStore {
  private entities: Map<string, Entity> = new Map();
  private users: Map<string, User> = new Map();
  public roles: Map<string, UserRole> = new Map();
  private currentUserId: string | null = null;

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Root entity: Reliant
    const reliant: Entity = {
      id: 'entity-reliant',
      name: 'Reliant',
      type: 'root',
      logo: '/lovable-uploads/reliant-logo.png', // Will need to be created
      brandColor: '#1e40af',
      createdAt: new Date('2024-01-01'),
    };
    this.entities.set(reliant.id, reliant);

    // Direct customer: Coterie (no distributor parent)
    const coterie: Entity = {
      id: 'entity-coterie',
      name: 'Coterie Insurance',
      type: 'customer',
      logo: '/src/assets/coterie-logo.png',
      brandColor: '#7c3aed',
      createdAt: new Date('2024-02-01'),
    };
    this.entities.set(coterie.id, coterie);

    // Distributors (Banks)
    const northwestBank: Entity = {
      id: 'entity-northwest',
      name: 'Northwest Bank',
      type: 'distributor',
      logo: '/src/assets/northwest-bank-logo.png',
      brandColor: '#059669',
      createdAt: new Date('2024-01-15'),
    };
    this.entities.set(northwestBank.id, northwestBank);

    const axosBank: Entity = {
      id: 'entity-axos',
      name: 'Axos Bank',
      type: 'distributor',
      logo: '/src/assets/axos-bank-logo.png',
      brandColor: '#dc2626',
      createdAt: new Date('2024-01-20'),
    };
    this.entities.set(axosBank.id, axosBank);

    // Customers under Northwest Bank
    const nwCustomer1: Entity = {
      id: 'entity-nw-customer-1',
      name: 'Smith Manufacturing',
      type: 'customer',
      logo: '/lovable-uploads/b8219251-a9f5-4a4d-afdd-08c4573a268d.png',
      parentEntityId: northwestBank.id,
      brandColor: '#2563eb',
      createdAt: new Date('2024-03-01'),
    };
    this.entities.set(nwCustomer1.id, nwCustomer1);

    const nwCustomer2: Entity = {
      id: 'entity-nw-customer-2',
      name: 'Johnson Logistics',
      type: 'customer',
      logo: '/lovable-uploads/35732e94-7d2c-42fe-9948-65816587b726.png',
      parentEntityId: northwestBank.id,
      brandColor: '#0891b2',
      createdAt: new Date('2024-03-15'),
    };
    this.entities.set(nwCustomer2.id, nwCustomer2);

    // Customers under Axos Bank
    const axosCustomer1: Entity = {
      id: 'entity-axos-customer-1',
      name: 'Williams Retail',
      type: 'customer',
      logo: '/lovable-uploads/15de4c78-6af4-4aa6-92c9-16fa882c3521.png',
      parentEntityId: axosBank.id,
      brandColor: '#ea580c',
      createdAt: new Date('2024-03-20'),
    };
    this.entities.set(axosCustomer1.id, axosCustomer1);

    // Create roles
    this.createDefaultRoles();
    
    // Create mock users
    this.createMockUsers();
    
    // Set current user to Reliant admin for testing
    this.currentUserId = 'user-reliant-admin';
  }

  private createDefaultRoles() {
    // Reliant roles
    const reliantAdmin: UserRole = {
      id: 'role-reliant-admin',
      name: 'Reliant Administrator',
      entityId: 'entity-reliant',
      permissions: PERMISSIONS.map(p => p.id), // All permissions
    };
    this.roles.set(reliantAdmin.id, reliantAdmin);

    // Coterie roles
    const coterieAdmin: UserRole = {
      id: 'role-coterie-admin',
      name: 'Administrator',
      entityId: 'entity-coterie',
      permissions: [
        'campaigns.view', 'campaigns.create', 'campaigns.edit', 'campaigns.delete', 'campaigns.send',
        'users.view', 'users.create', 'users.edit', 'users.delete',
        'reports.view', 'reports.export',
        'settings.view', 'settings.edit',
      ],
    };
    this.roles.set(coterieAdmin.id, coterieAdmin);

    const coterieCampaignManager: UserRole = {
      id: 'role-coterie-campaign-mgr',
      name: 'Campaign Manager',
      entityId: 'entity-coterie',
      permissions: [
        'campaigns.view', 'campaigns.create', 'campaigns.edit', 'campaigns.send',
        'reports.view',
      ],
    };
    this.roles.set(coterieCampaignManager.id, coterieCampaignManager);

    // Distributor roles (Northwest Bank)
    const distributorAdmin: UserRole = {
      id: 'role-nw-admin',
      name: 'Bank Administrator',
      entityId: 'entity-northwest',
      permissions: [
        'campaigns.view', 'campaigns.create', 'campaigns.edit', 'campaigns.delete', 'campaigns.send',
        'users.view', 'users.create', 'users.edit', 'users.delete',
        'reports.view', 'reports.export',
        'settings.view', 'settings.edit',
        'entities.view', 'entities.create', 'entities.edit',
      ],
    };
    this.roles.set(distributorAdmin.id, distributorAdmin);
  }

  private createMockUsers() {
    // Reliant users
    const reliantAdmin: User = {
      id: 'user-reliant-admin',
      name: 'Alex Rivera',
      email: 'alex@reliant.com',
      entityId: 'entity-reliant',
      roleId: 'role-reliant-admin',
      createdAt: new Date('2024-01-01'),
    };
    this.users.set(reliantAdmin.id, reliantAdmin);

    // Coterie users
    const coterieAdmin: User = {
      id: 'user-coterie-admin',
      name: 'Sarah Chen',
      email: 'sarah@coterie.com',
      entityId: 'entity-coterie',
      roleId: 'role-coterie-admin',
      createdAt: new Date('2024-02-01'),
    };
    this.users.set(coterieAdmin.id, coterieAdmin);

    const coterieCampaignMgr: User = {
      id: 'user-coterie-campaign-mgr',
      name: 'Mike Johnson',
      email: 'mike@coterie.com',
      entityId: 'entity-coterie',
      roleId: 'role-coterie-campaign-mgr',
      createdAt: new Date('2024-02-15'),
    };
    this.users.set(coterieCampaignMgr.id, coterieCampaignMgr);

    // Northwest Bank users
    const nwAdmin: User = {
      id: 'user-nw-admin',
      name: 'Jennifer Martinez',
      email: 'jennifer@northwestbank.com',
      entityId: 'entity-northwest',
      roleId: 'role-nw-admin',
      createdAt: new Date('2024-01-15'),
    };
    this.users.set(nwAdmin.id, nwAdmin);
  }

  // Current user methods
  getCurrentUser(): User | null {
    if (!this.currentUserId) return null;
    return this.users.get(this.currentUserId) || null;
  }

  setCurrentUser(userId: string) {
    this.currentUserId = userId;
  }

  getCurrentUserEntity(): Entity | null {
    const user = this.getCurrentUser();
    if (!user) return null;
    return this.entities.get(user.entityId) || null;
  }

  getCurrentUserRole(): UserRole | null {
    const user = this.getCurrentUser();
    if (!user) return null;
    return this.roles.get(user.roleId) || null;
  }

  hasPermission(permission: string): boolean {
    const role = this.getCurrentUserRole();
    if (!role) return false;
    return role.permissions.includes(permission);
  }

  // Entity methods
  getEntity(entityId: string): Entity | null {
    return this.entities.get(entityId) || null;
  }

  getAllEntities(): Entity[] {
    return Array.from(this.entities.values());
  }

  getDistributors(): Entity[] {
    return this.getAllEntities().filter(e => e.type === 'distributor');
  }

  getCustomers(distributorId?: string): Entity[] {
    if (distributorId) {
      return this.getAllEntities().filter(
        e => e.type === 'customer' && e.parentEntityId === distributorId
      );
    }
    return this.getAllEntities().filter(e => e.type === 'customer');
  }

  getDirectCustomers(): Entity[] {
    return this.getAllEntities().filter(
      e => e.type === 'customer' && !e.parentEntityId
    );
  }

  getEntityHierarchy(entityId: string): Entity[] {
    const hierarchy: Entity[] = [];
    let currentEntity = this.getEntity(entityId);
    
    while (currentEntity) {
      hierarchy.unshift(currentEntity);
      if (currentEntity.parentEntityId) {
        currentEntity = this.getEntity(currentEntity.parentEntityId);
      } else {
        break;
      }
    }
    
    return hierarchy;
  }

  // Get branding for current context
  getCurrentBranding(): Entity {
    const user = this.getCurrentUser();
    if (!user) {
      return this.entities.get('entity-reliant')!;
    }

    const userEntity = this.entities.get(user.entityId)!;
    
    // If user is from Reliant, show Reliant branding
    if (userEntity.type === 'root') {
      return userEntity;
    }
    
    // If user is from a distributor, show distributor branding
    if (userEntity.type === 'distributor') {
      return userEntity;
    }
    
    // If user is from a customer
    if (userEntity.type === 'customer') {
      // If customer has a parent distributor, show distributor branding
      if (userEntity.parentEntityId) {
        return this.entities.get(userEntity.parentEntityId)!;
      }
      // If direct customer, show their own branding
      return userEntity;
    }
    
    return userEntity;
  }

  // User switching for testing
  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }
}

export const entityStore = new EntityStore();
