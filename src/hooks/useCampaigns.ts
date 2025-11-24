import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Campaign } from '@/types/campaign';
import { useToast } from '@/hooks/use-toast';

export function useCampaigns(entityId?: string) {
  return useQuery({
    queryKey: ['campaigns', entityId],
    queryFn: async () => {
      let query = supabase
        .from('campaigns')
        .select(`
          *,
          campaign_payment_methods(*),
          consumers(*)
        `)
        .order('created_at', { ascending: false });
      
      if (entityId) {
        query = query.eq('entity_id', entityId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Campaign[];
    },
  });
}

export function useCampaign(campaignId: string | undefined) {
  return useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: async () => {
      if (!campaignId) throw new Error('Campaign ID is required');
      
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          campaign_payment_methods(*),
          consumers(*)
        `)
        .eq('id', campaignId)
        .single();
      
      if (error) throw error;
      return data as Campaign;
    },
    enabled: !!campaignId,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (campaign: Partial<Campaign>) => {
      const { consumers, paymentMethods, ...campaignData } = campaign as any;
      
      // Insert campaign
      const { data: newCampaign, error: campaignError } = await supabase
        .from('campaigns')
        .insert(campaignData)
        .select()
        .single();
      
      if (campaignError) throw campaignError;
      
      // Insert payment methods
      if (paymentMethods && paymentMethods.length > 0) {
        const paymentMethodsData = paymentMethods.map((pm: any) => ({
          campaign_id: newCampaign.id,
          ...pm
        }));
        
        const { error: pmError } = await supabase
          .from('campaign_payment_methods')
          .insert(paymentMethodsData);
        
        if (pmError) throw pmError;
      }
      
      // Insert consumers
      if (consumers && consumers.length > 0) {
        const consumersData = consumers.map((c: any) => ({
          campaign_id: newCampaign.id,
          ...c
        }));
        
        const { error: consError } = await supabase
          .from('consumers')
          .insert(consumersData);
        
        if (consError) throw consError;
      }
      
      return newCampaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: "Campaign created",
        description: "Your campaign has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating campaign",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Campaign> & { id: string }) => {
      const { consumers, paymentMethods, ...campaignData } = updates as any;
      
      const { data, error } = await supabase
        .from('campaigns')
        .update(campaignData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', variables.id] });
      toast({
        title: "Campaign updated",
        description: "Your campaign has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating campaign",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (campaignId: string) => {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: "Campaign deleted",
        description: "The campaign has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting campaign",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useSendCampaign() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (campaignId: string) => {
      // Update campaign status
      const { error: updateError } = await supabase
        .from('campaigns')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', campaignId);
      
      if (updateError) throw updateError;

      // Get all consumers for this campaign
      const { data: consumers, error: consumersError } = await supabase
        .from('consumers')
        .select('id')
        .eq('campaign_id', campaignId);

      if (consumersError) throw consumersError;

      // Generate consumer tokens
      if (consumers && consumers.length > 0) {
        for (const consumer of consumers) {
          const { error: tokenError } = await supabase.rpc('generate_consumer_token', {
            _consumer_id: consumer.id,
            _campaign_id: campaignId
          });
          
          if (tokenError) throw tokenError;
        }
      }

      // Generate mock tracking data
      const { error: mockError } = await supabase.rpc('generate_mock_tracking_data', {
        _campaign_id: campaignId
      });
      
      if (mockError) throw mockError;
    },
    onSuccess: (_, campaignId) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
      toast({
        title: "Campaign sent",
        description: "Mock data has been generated for all consumers.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error sending campaign",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
