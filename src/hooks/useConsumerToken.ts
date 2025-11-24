import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useValidateToken(token: string | undefined) {
  return useQuery({
    queryKey: ['validateToken', token],
    queryFn: async () => {
      if (!token) throw new Error('Token is required');
      
      const { data, error } = await supabase
        .from('consumer_tokens')
        .select(`
          *,
          consumers(*),
          campaigns(
            *,
            campaign_payment_methods(*)
          )
        `)
        .eq('token', token)
        .eq('used', false)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!token,
  });
}

export function useMarkTokenUsed() {
  return useMutation({
    mutationFn: async (token: string) => {
      const { error } = await supabase
        .from('consumer_tokens')
        .update({ 
          used: true,
          used_at: new Date().toISOString()
        })
        .eq('token', token);
      
      if (error) throw error;
    },
  });
}
