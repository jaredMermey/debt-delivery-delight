import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Invitation {
  id: string;
  email: string;
  entity_id: string;
  role_id: string;
  token: string;
  expires_at: string;
  used: boolean;
  used_at: string | null;
  invited_by: string | null;
  created_at: string;
}

export function useInvitations() {
  return useQuery({
    queryKey: ['invitations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_invitations')
        .select('*, entities(name), roles(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useInvitationByToken(token: string | null) {
  return useQuery({
    queryKey: ['invitation', token],
    queryFn: async () => {
      if (!token) return null;
      
      const { data, error } = await supabase
        .from('user_invitations')
        .select('*, entities(name), roles(name)')
        .eq('token', token)
        .eq('used', false)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!token,
  });
}

export function useCreateInvitation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { email: string; entity_id: string; role_id: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: token, error } = await supabase.rpc('generate_invitation_token', {
        _email: data.email,
        _entity_id: data.entity_id,
        _role_id: data.role_id,
        _invited_by: user.id,
      });

      if (error) throw error;
      return token;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      toast({
        title: 'Invitation sent',
        description: 'User invitation has been created successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to send invitation',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteInvitation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_invitations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      toast({
        title: 'Invitation deleted',
        description: 'User invitation has been revoked.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to delete invitation',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
