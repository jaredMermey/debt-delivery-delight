/**
 * @deprecated This file is deprecated and should not be used.
 * All campaign operations now use Supabase hooks from @/hooks/useCampaigns.ts
 * This file is kept only for reference and will be removed in a future update.
 */

import { Campaign, PaymentMethodConfig, Consumer, PaymentMethodType, ConsumerTracking, CampaignStats } from '@/types/campaign';

// Mock data store - DEPRECATED - Use Supabase hooks instead
class CampaignStore {
  private campaigns: Campaign[] = [];
  private tracking: ConsumerTracking[] = [];

  createCampaign(campaign: Omit<Campaign, 'id' | 'created_at' | 'status'>): Campaign {
    const newCampaign: Campaign = {
      ...campaign,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      status: 'draft'
    };
    this.campaigns.push(newCampaign);
    return newCampaign;
  }

  updateCampaign(id: string, updates: Partial<Campaign>): Campaign | null {
    const index = this.campaigns.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    this.campaigns[index] = { ...this.campaigns[index], ...updates };
    return this.campaigns[index];
  }

  getCampaign(id: string): Campaign | null {
    return this.campaigns.find(c => c.id === id) || null;
  }

  getAllCampaigns(): Campaign[] {
    return this.campaigns;
  }

  deleteCampaign(id: string): boolean {
    const index = this.campaigns.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.campaigns.splice(index, 1);
    return true;
  }

  // Helper methods
  getTotalDisbursement(campaignId: string): number {
    const campaign = this.getCampaign(campaignId);
    if (!campaign) return 0;
    return campaign.consumers.reduce((total, consumer) => total + consumer.amount, 0);
  }

  addConsumer(campaignId: string, consumer: Omit<Consumer, 'id'>): Consumer | null {
    const campaign = this.getCampaign(campaignId);
    if (!campaign) return null;

    const newConsumer: Consumer = {
      ...consumer,
      id: Math.random().toString(36).substr(2, 9)
    };

    campaign.consumers.push(newConsumer);

    // If campaign has been sent, create tracking entry for new consumer
    const isSentCampaign = ['sent', 'active', 'completed'].includes(campaign.status);
    if (isSentCampaign) {
      const now = new Date().toISOString();
      const newTracking: ConsumerTracking = {
        consumer_id: newConsumer.id,
        campaign_id: campaignId,
        email_sent: false,
        email_opened: false,
        link_clicked: false,
        funds_originated: false,
        funds_settled: false,
        status: 'pending',
        last_activity: now
      };
      this.tracking.push(newTracking);
      
      // Update campaign stats
      this.updateCampaignStats(campaignId);
    }

    return newConsumer;
  }

  updateConsumer(campaignId: string, consumerId: string, updates: Partial<Consumer>): Consumer | null {
    const campaign = this.getCampaign(campaignId);
    if (!campaign) return null;

    const consumerIndex = campaign.consumers.findIndex(c => c.id === consumerId);
    if (consumerIndex === -1) return null;

    campaign.consumers[consumerIndex] = { ...campaign.consumers[consumerIndex], ...updates };
    return campaign.consumers[consumerIndex];
  }

  removeConsumer(campaignId: string, consumerId: string): boolean {
    const campaign = this.getCampaign(campaignId);
    if (!campaign) return false;

    const consumerIndex = campaign.consumers.findIndex(c => c.id === consumerId);
    if (consumerIndex === -1) return false;

    campaign.consumers.splice(consumerIndex, 1);
    return true;
  }

  // Campaign sending and tracking methods
  sendCampaign(campaignId: string): Campaign | null {
    const campaign = this.getCampaign(campaignId);
    if (!campaign) return null;

    // Update campaign status
    const updates: Partial<Campaign> = {
      status: 'sent',
      sent_at: new Date().toISOString(),
      total_emails_sent: campaign.consumers.length,
      total_emails_opened: 0,
      total_links_clicked: 0,
      total_funds_selected: 0,
      total_funds_originated: 0,
      total_funds_settled: 0
    };

    const updatedCampaign = this.updateCampaign(campaignId, updates);
    if (!updatedCampaign) return null;

    // Generate mock tracking data for all consumers
    this.generateMockTrackingData(campaignId, campaign.consumers);

    return updatedCampaign;
  }

  private generateMockTrackingData(campaignId: string, consumers: Consumer[]) {
    const now = new Date();
    
    consumers.forEach(consumer => {
      // Generate realistic progression through the funnel
      const progression = Math.random();
      let status: ConsumerTracking['status'] = 'email_sent';
      let email_opened = false;
      let link_clicked = false;
      let funds_originated = false;
      let funds_settled = false;
      let payment_method_selected: PaymentMethodType | undefined;
      
      // Email sent (100%)
      const email_sent_at = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000).toISOString(); // Within last 24 hours
      
      // Email opened (70% chance)
      let email_opened_at: string | undefined;
      if (progression > 0.3) {
        email_opened = true;
        status = 'email_opened';
        email_opened_at = new Date(new Date(email_sent_at).getTime() + Math.random() * 2 * 60 * 60 * 1000).toISOString(); // Within 2 hours of email
      }

      // Link clicked (50% of those who opened)
      let link_clicked_at: string | undefined;
      if (email_opened && progression > 0.5) {
        link_clicked = true;
        status = 'link_clicked';
        link_clicked_at = new Date(new Date(email_opened_at!).getTime() + Math.random() * 30 * 60 * 1000).toISOString(); // Within 30 mins of opening
      }

      // Payment method selected (80% of those who clicked)
      let payment_method_selected_at: string | undefined;
      if (link_clicked && progression > 0.6) {
        status = 'payment_selected';
        const methods: PaymentMethodType[] = ['ach', 'prepaid', 'check', 'realtime', 'venmo', 'paypal'];
        payment_method_selected = methods[Math.floor(Math.random() * methods.length)];
        payment_method_selected_at = new Date(new Date(link_clicked_at!).getTime() + Math.random() * 10 * 60 * 1000).toISOString(); // Within 10 mins
      }

      // Funds originated (60% of those who selected payment)
      let funds_originated_at: string | undefined;
      if (payment_method_selected && progression > 0.7) {
        funds_originated = true;
        status = 'funds_originated';
        funds_originated_at = new Date(new Date(payment_method_selected_at!).getTime() + Math.random() * 60 * 60 * 1000).toISOString(); // Within 1 hour
      }

      // Funds settled (90% of those originated)
      let funds_settled_at: string | undefined;
      if (funds_originated && progression > 0.8) {
        funds_settled = true;
        status = 'funds_settled';
        funds_settled_at = new Date(new Date(funds_originated_at!).getTime() + Math.random() * 24 * 60 * 60 * 1000).toISOString(); // Within 24 hours
      }

      const tracking: ConsumerTracking = {
        consumer_id: consumer.id,
        campaign_id: campaignId,
        email_sent: true,
        email_sent_at,
        email_opened,
        email_opened_at,
        link_clicked,
        link_clicked_at,
        payment_method_selected,
        payment_method_selected_at,
        funds_originated,
        funds_originated_at,
        funds_settled,
        funds_settled_at,
        status,
        last_activity: funds_settled_at || funds_originated_at || payment_method_selected_at || link_clicked_at || email_opened_at || email_sent_at
      };

      this.tracking.push(tracking);
    });

    // Update campaign stats
    this.updateCampaignStats(campaignId);
  }

  private updateCampaignStats(campaignId: string) {
    const trackingData = this.getConsumerTracking(campaignId);
    const campaign = this.getCampaign(campaignId);
    if (!campaign) return;

    const stats = {
      total_emails_sent: trackingData.filter(t => t.email_sent).length,
      total_emails_opened: trackingData.filter(t => t.email_opened).length,
      total_links_clicked: trackingData.filter(t => t.link_clicked).length,
      total_funds_selected: trackingData.filter(t => t.payment_method_selected).length,
      total_funds_originated: trackingData.filter(t => t.funds_originated).length,
      total_funds_settled: trackingData.filter(t => t.funds_settled).length,
    };

    this.updateCampaign(campaignId, stats);
  }

  getConsumerTracking(campaignId: string): ConsumerTracking[] {
    return this.tracking.filter(t => t.campaign_id === campaignId);
  }

  updateConsumerTracking(consumerId: string, updates: Partial<ConsumerTracking>): ConsumerTracking | null {
    const index = this.tracking.findIndex(t => t.consumer_id === consumerId);
    if (index === -1) return null;

    this.tracking[index] = { ...this.tracking[index], ...updates };
    
    // Update campaign stats after individual consumer update
    this.updateCampaignStats(this.tracking[index].campaign_id);
    
    return this.tracking[index];
  }

  searchConsumers(campaignId: string, query: string = '', filters: {
    status?: ConsumerTracking['status'];
    paymentMethod?: PaymentMethodType;
  } = {}): (Consumer & { tracking: ConsumerTracking })[] {
    const campaign = this.getCampaign(campaignId);
    if (!campaign) return [];

    const trackingData = this.getConsumerTracking(campaignId);
    
    let results = campaign.consumers.map(consumer => {
      const tracking = trackingData.find(t => t.consumer_id === consumer.id);
      return { ...consumer, tracking: tracking! };
    }).filter(item => item.tracking); // Only include consumers with tracking data

    // Apply search query
    if (query.trim()) {
      const searchLower = query.toLowerCase();
      results = results.filter(item => 
        item.name.toLowerCase().includes(searchLower) ||
        item.email.toLowerCase().includes(searchLower)
      );
    }

    // Apply filters
    if (filters.status) {
      results = results.filter(item => item.tracking.status === filters.status);
    }

    if (filters.paymentMethod) {
      results = results.filter(item => item.tracking.payment_method_selected === filters.paymentMethod);
    }

    return results;
  }

  getCampaignStats(campaignId: string): CampaignStats | null {
    const campaign = this.getCampaign(campaignId);
    const trackingData = this.getConsumerTracking(campaignId);
    
    if (!campaign) return null;

    const total_amount = campaign.consumers.reduce((sum, c) => sum + c.amount, 0);
    const originatedConsumers = trackingData.filter(t => t.funds_originated);
    const settledConsumers = trackingData.filter(t => t.funds_settled);
    
    const originated_amount = originatedConsumers.reduce((sum, t) => {
      const consumer = campaign.consumers.find(c => c.id === t.consumer_id);
      return sum + (consumer?.amount || 0);
    }, 0);
    
    const settled_amount = settledConsumers.reduce((sum, t) => {
      const consumer = campaign.consumers.find(c => c.id === t.consumer_id);
      return sum + (consumer?.amount || 0);
    }, 0);

    const emails_sent = trackingData.filter(t => t.email_sent).length;
    const emails_opened = trackingData.filter(t => t.email_opened).length;
    const links_clicked = trackingData.filter(t => t.link_clicked).length;

    return {
      campaign_id: campaignId,
      total_consumers: campaign.consumers.length,
      emails_sent,
      emails_opened,
      links_clicked,
      funds_selected: trackingData.filter(t => t.payment_method_selected).length,
      funds_originated: originatedConsumers.length,
      funds_settled: settledConsumers.length,
      total_amount,
      originated_amount,
      settled_amount,
      email_open_rate: emails_sent > 0 ? (emails_opened / emails_sent) * 100 : 0,
      link_click_rate: emails_opened > 0 ? (links_clicked / emails_opened) * 100 : 0,
      completion_rate: campaign.consumers.length > 0 ? (settledConsumers.length / campaign.consumers.length) * 100 : 0
    };
  }
}

export const campaignStore = new CampaignStore();

// Default payment method configurations
export const DEFAULT_PAYMENT_METHODS: PaymentMethodConfig[] = [
  { type: 'prepaid', enabled: true, fee_type: 'dollar', fee_amount: 0, display_order: 1 },
  { type: 'check', enabled: true, fee_type: 'dollar', fee_amount: 0, display_order: 2 },
  { type: 'ach', enabled: true, fee_type: 'dollar', fee_amount: 0, display_order: 3 },
  { type: 'realtime', enabled: true, fee_type: 'percentage', fee_amount: 1, display_order: 4 },
  { type: 'venmo', enabled: true, fee_type: 'dollar', fee_amount: 0, display_order: 5 },
  { type: 'paypal', enabled: true, fee_type: 'dollar', fee_amount: 0, display_order: 6 },
  { type: 'international', enabled: true, fee_type: 'dollar', fee_amount: 0, display_order: 7 },
  { type: 'crypto', enabled: true, fee_type: 'dollar', fee_amount: 0, display_order: 8 }
];
