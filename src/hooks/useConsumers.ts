import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Consumer } from '@/types/campaign';
import { useToast } from '@/hooks/use-toast';
import { TablesInsert } from '@/integrations/supabase/types';

export function useConsumers(campaignId: string | undefined) {
  return useQuery({
    queryKey: ['consumers', campaignId],
    queryFn: async () => {
      if (!campaignId) throw new Error('Campaign ID is required');
      
      const { data, error } = await supabase
        .from('consumers')
        .select(`
          *,
          consumer_tracking(*)
        `)
        .eq('campaign_id', campaignId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!campaignId,
  });
}

export function useAddConsumer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ campaignId, consumer }: { campaignId: string; consumer: Partial<Consumer> }) => {
      const insertData: TablesInsert<'consumers'> = {
        name: consumer.name!,
        email: consumer.email!,
        amount: consumer.amount!,
        campaign_id: campaignId
      };
      
      const { data, error } = await supabase
        .from('consumers')
        .insert(insertData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['consumers', variables.campaignId] });
      queryClient.invalidateQueries({ queryKey: ['campaign', variables.campaignId] });
      toast({
        title: "Consumer added",
        description: "The consumer has been added to the campaign.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding consumer",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useAddConsumers() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ campaignId, consumers }: { campaignId: string; consumers: Partial<Consumer>[] }) => {
      const consumersData: TablesInsert<'consumers'>[] = consumers.map(c => ({
        name: c.name!,
        email: c.email!,
        amount: c.amount!,
        campaign_id: campaignId
      }));
      
      const { data: newConsumers, error } = await supabase
        .from('consumers')
        .insert(consumersData)
        .select();
      
      if (error) throw error;
      
      // Check if campaign is sent and generate tracking data
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .select('status')
        .eq('id', campaignId)
        .single();
      
      if (campaignError) throw campaignError;
      
      if (campaign.status === 'sent' && newConsumers) {
        // Generate token for each new consumer
        for (const consumer of newConsumers) {
          const { error: tokenError } = await supabase.rpc('generate_consumer_token', {
            _consumer_id: consumer.id,
            _campaign_id: campaignId
          });
          
          if (tokenError) throw tokenError;
        }
        
        // Generate tracking data for new consumers
        const { error: trackingError } = await supabase.rpc('generate_mock_tracking_data', {
          _campaign_id: campaignId
        });
        
        if (trackingError) throw trackingError;
      }
      
      return newConsumers;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['consumers', variables.campaignId] });
      queryClient.invalidateQueries({ queryKey: ['campaign', variables.campaignId] });
      queryClient.invalidateQueries({ queryKey: ['consumerTracking', variables.campaignId] });
      queryClient.invalidateQueries({ queryKey: ['campaignStats', variables.campaignId] });
      toast({
        title: "Consumers added",
        description: `${variables.consumers.length} consumers have been added to the campaign.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding consumers",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteConsumer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ consumerId, campaignId }: { consumerId: string; campaignId: string }) => {
      const { error } = await supabase
        .from('consumers')
        .delete()
        .eq('id', consumerId);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['consumers', variables.campaignId] });
      queryClient.invalidateQueries({ queryKey: ['campaign', variables.campaignId] });
      toast({
        title: "Consumer deleted",
        description: "The consumer has been removed from the campaign.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting consumer",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useConsumerTracking(campaignId: string | undefined) {
  return useQuery({
    queryKey: ['consumerTracking', campaignId],
    queryFn: async () => {
      if (!campaignId) throw new Error('Campaign ID is required');
      
      const { data, error } = await supabase
        .from('consumer_tracking')
        .select(`
          *,
          consumers(*)
        `)
        .eq('campaign_id', campaignId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!campaignId,
  });
}

export function useCampaignStats(campaignId: string | undefined) {
  return useQuery({
    queryKey: ['campaignStats', campaignId],
    queryFn: async () => {
      if (!campaignId) throw new Error('Campaign ID is required');
      
      const { data, error } = await supabase
        .from('campaign_stats')
        .select('*')
        .eq('campaign_id', campaignId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!campaignId,
  });
}
