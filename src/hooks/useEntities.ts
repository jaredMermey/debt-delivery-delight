import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Entity } from '@/types/campaign';

export function useEntities() {
  return useQuery({
    queryKey: ['entities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entities')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      return data as Entity[];
    },
  });
}

export function useCurrentUserEntity() {
  return useQuery({
    queryKey: ['currentUserEntity'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          entity_id,
          entities (
            id,
            name,
            type,
            logo,
            brand_color,
            parent_entity_id,
            created_at
          )
        `)
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      // @ts-ignore - Supabase types need manual casting
      return profile?.entities as Entity | null;
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return profile;
    },
  });
}

export function useCurrentUserRole() {
  return useQuery({
    queryKey: ['currentUserRole'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          role_id,
          roles (
            id,
            name,
            entity_id
          )
        `)
        .eq('user_id', user.id)
        .limit(1)
        .single();
      
      if (error) throw error;
      // @ts-ignore
      return data?.roles || null;
    },
  });
}

export function useHasPermission(permission: string) {
  return useQuery({
    queryKey: ['hasPermission', permission],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase.rpc('has_permission', {
        _user_id: user.id,
        _permission: permission
      });
      
      if (error) throw error;
      return data as boolean;
    },
  });
}

export function useUserPermissions() {
  return useQuery({
    queryKey: ['userPermissions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          roles (
            role_permissions (
              permissions (
                id,
                name,
                description,
                category
              )
            )
          )
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Flatten permissions
      // @ts-ignore
      const permissions = data?.flatMap(ur => 
        // @ts-ignore
        ur.roles?.role_permissions?.map(rp => rp.permissions) || []
      ) || [];
      
      return permissions;
    },
  });
}

export function useCreateEntity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (entity: Omit<Entity, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('entities')
        .insert(entity)
        .select()
        .single();
      
      if (error) throw error;
      return data as Entity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
    },
  });
}

export function useUpdateEntity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Entity> & { id: string }) => {
      const { data, error } = await supabase
        .from('entities')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Entity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
    },
  });
}

export function useDeleteEntity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('entities')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
    },
  });
}
