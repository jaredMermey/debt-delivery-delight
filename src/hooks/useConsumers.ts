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
        // Generate token and tracking data for each new consumer
        for (const consumer of newConsumers) {
          // Generate token
          const { error: tokenError } = await supabase.rpc('generate_consumer_token', {
            _consumer_id: consumer.id,
            _campaign_id: campaignId
          });
          
          if (tokenError) throw tokenError;
          
          // Generate mock tracking data for this consumer
          const progression = Math.random();
          const emailSentAt = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000);
          const emailOpenedAt = progression > 0.3 ? new Date(emailSentAt.getTime() + Math.random() * 2 * 60 * 60 * 1000) : null;
          const linkClickedAt = emailOpenedAt && progression > 0.5 ? new Date(emailOpenedAt.getTime() + Math.random() * 30 * 60 * 1000) : null;
          const paymentMethods = ['ach', 'prepaid', 'check', 'realtime', 'venmo', 'paypal'];
          const paymentMethodSelected = linkClickedAt && progression > 0.6 ? paymentMethods[Math.floor(Math.random() * paymentMethods.length)] : null;
          const paymentSelectedAt = paymentMethodSelected ? new Date(linkClickedAt!.getTime() + Math.random() * 10 * 60 * 1000) : null;
          const fundsOriginatedAt = paymentSelectedAt && progression > 0.7 ? new Date(paymentSelectedAt.getTime() + Math.random() * 60 * 60 * 1000) : null;
          const fundsSettledAt = fundsOriginatedAt && progression > 0.8 ? new Date(fundsOriginatedAt.getTime() + Math.random() * 24 * 60 * 60 * 1000) : null;
          
          let status: 'email_sent' | 'email_opened' | 'link_clicked' | 'payment_selected' | 'funds_originated' | 'funds_settled' = 'email_sent';
          if (fundsSettledAt) status = 'funds_settled';
          else if (fundsOriginatedAt) status = 'funds_originated';
          else if (paymentMethodSelected) status = 'payment_selected';
          else if (linkClickedAt) status = 'link_clicked';
          else if (emailOpenedAt) status = 'email_opened';
          
          const { error: trackingError } = await supabase
            .from('consumer_tracking')
            .insert({
              consumer_id: consumer.id,
              campaign_id: campaignId,
              status,
              email_sent: true,
              email_sent_at: emailSentAt.toISOString(),
              email_opened: !!emailOpenedAt,
              email_opened_at: emailOpenedAt?.toISOString(),
              link_clicked: !!linkClickedAt,
              link_clicked_at: linkClickedAt?.toISOString(),
              payment_method_selected: paymentMethodSelected as any,
              payment_method_selected_at: paymentSelectedAt?.toISOString(),
              funds_originated: !!fundsOriginatedAt,
              funds_originated_at: fundsOriginatedAt?.toISOString(),
              funds_settled: !!fundsSettledAt,
              funds_settled_at: fundsSettledAt?.toISOString(),
              last_activity: (fundsSettledAt || fundsOriginatedAt || paymentSelectedAt || linkClickedAt || emailOpenedAt || emailSentAt).toISOString()
            });
          
          if (trackingError) throw trackingError;
        }
        
        // Update campaign stats after adding new consumers
        const { error: statsError } = await supabase.rpc('update_campaign_stats', {
          _campaign_id: campaignId
        });
        
        if (statsError) throw statsError;
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
