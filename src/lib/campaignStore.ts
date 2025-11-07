import { Campaign, PaymentMethodConfig, Consumer, PaymentMethodType, ConsumerTracking, CampaignStats } from '@/types/campaign';

// Mock data store - can be replaced with Supabase later
class CampaignStore {
  private campaigns: Campaign[] = [];
  private tracking: ConsumerTracking[] = [];

  createCampaign(campaign: Omit<Campaign, 'id' | 'createdAt' | 'status'>): Campaign {
    const newCampaign: Campaign = {
      ...campaign,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
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
      const now = new Date();
      const newTracking: ConsumerTracking = {
        consumerId: newConsumer.id,
        campaignId,
        emailSent: false,
        emailOpened: false,
        linkClicked: false,
        fundsOriginated: false,
        fundsSettled: false,
        status: 'pending',
        lastActivity: now
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
      sentAt: new Date(),
      totalEmailsSent: campaign.consumers.length,
      totalEmailsOpened: 0,
      totalLinksClicked: 0,
      totalFundsSelected: 0,
      totalFundsOriginated: 0,
      totalFundsSettled: 0
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
      let emailOpened = false;
      let linkClicked = false;
      let fundsOriginated = false;
      let fundsSettled = false;
      let paymentMethodSelected: PaymentMethodType | undefined;
      
      // Email sent (100%)
      const emailSentAt = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000); // Within last 24 hours
      
      // Email opened (70% chance)
      let emailOpenedAt: Date | undefined;
      if (progression > 0.3) {
        emailOpened = true;
        status = 'email_opened';
        emailOpenedAt = new Date(emailSentAt.getTime() + Math.random() * 2 * 60 * 60 * 1000); // Within 2 hours of email
      }

      // Link clicked (50% of those who opened)
      let linkClickedAt: Date | undefined;
      if (emailOpened && progression > 0.5) {
        linkClicked = true;
        status = 'link_clicked';
        linkClickedAt = new Date(emailOpenedAt!.getTime() + Math.random() * 30 * 60 * 1000); // Within 30 mins of opening
      }

      // Payment method selected (80% of those who clicked)
      let paymentMethodSelectedAt: Date | undefined;
      if (linkClicked && progression > 0.6) {
        status = 'payment_selected';
        const methods: PaymentMethodType[] = ['ach', 'prepaid', 'check', 'realtime', 'venmo', 'paypal'];
        paymentMethodSelected = methods[Math.floor(Math.random() * methods.length)];
        paymentMethodSelectedAt = new Date(linkClickedAt!.getTime() + Math.random() * 10 * 60 * 1000); // Within 10 mins
      }

      // Funds originated (60% of those who selected payment)
      let fundsOriginatedAt: Date | undefined;
      if (paymentMethodSelected && progression > 0.7) {
        fundsOriginated = true;
        status = 'funds_originated';
        fundsOriginatedAt = new Date(paymentMethodSelectedAt!.getTime() + Math.random() * 60 * 60 * 1000); // Within 1 hour
      }

      // Funds settled (90% of those originated)
      let fundsSettledAt: Date | undefined;
      if (fundsOriginated && progression > 0.8) {
        fundsSettled = true;
        status = 'funds_settled';
        fundsSettledAt = new Date(fundsOriginatedAt!.getTime() + Math.random() * 24 * 60 * 60 * 1000); // Within 24 hours
      }

      const tracking: ConsumerTracking = {
        consumerId: consumer.id,
        campaignId,
        emailSent: true,
        emailSentAt,
        emailOpened,
        emailOpenedAt,
        linkClicked,
        linkClickedAt,
        paymentMethodSelected,
        paymentMethodSelectedAt,
        fundsOriginated,
        fundsOriginatedAt,
        fundsSettled,
        fundsSettledAt,
        status,
        lastActivity: fundsSettledAt || fundsOriginatedAt || paymentMethodSelectedAt || linkClickedAt || emailOpenedAt || emailSentAt
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
      totalEmailsSent: trackingData.filter(t => t.emailSent).length,
      totalEmailsOpened: trackingData.filter(t => t.emailOpened).length,
      totalLinksClicked: trackingData.filter(t => t.linkClicked).length,
      totalFundsSelected: trackingData.filter(t => t.paymentMethodSelected).length,
      totalFundsOriginated: trackingData.filter(t => t.fundsOriginated).length,
      totalFundsSettled: trackingData.filter(t => t.fundsSettled).length,
    };

    this.updateCampaign(campaignId, stats);
  }

  getConsumerTracking(campaignId: string): ConsumerTracking[] {
    return this.tracking.filter(t => t.campaignId === campaignId);
  }

  updateConsumerTracking(consumerId: string, updates: Partial<ConsumerTracking>): ConsumerTracking | null {
    const index = this.tracking.findIndex(t => t.consumerId === consumerId);
    if (index === -1) return null;

    this.tracking[index] = { ...this.tracking[index], ...updates };
    
    // Update campaign stats after individual consumer update
    this.updateCampaignStats(this.tracking[index].campaignId);
    
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
      const tracking = trackingData.find(t => t.consumerId === consumer.id);
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
      results = results.filter(item => item.tracking.paymentMethodSelected === filters.paymentMethod);
    }

    return results;
  }

  getCampaignStats(campaignId: string): CampaignStats | null {
    const campaign = this.getCampaign(campaignId);
    const trackingData = this.getConsumerTracking(campaignId);
    
    if (!campaign) return null;

    const totalAmount = campaign.consumers.reduce((sum, c) => sum + c.amount, 0);
    const originatedConsumers = trackingData.filter(t => t.fundsOriginated);
    const settledConsumers = trackingData.filter(t => t.fundsSettled);
    
    const originatedAmount = originatedConsumers.reduce((sum, t) => {
      const consumer = campaign.consumers.find(c => c.id === t.consumerId);
      return sum + (consumer?.amount || 0);
    }, 0);
    
    const settledAmount = settledConsumers.reduce((sum, t) => {
      const consumer = campaign.consumers.find(c => c.id === t.consumerId);
      return sum + (consumer?.amount || 0);
    }, 0);

    const emailsSent = trackingData.filter(t => t.emailSent).length;
    const emailsOpened = trackingData.filter(t => t.emailOpened).length;
    const linksClicked = trackingData.filter(t => t.linkClicked).length;

    return {
      campaignId,
      totalConsumers: campaign.consumers.length,
      emailsSent,
      emailsOpened,
      linksClicked,
      fundsSelected: trackingData.filter(t => t.paymentMethodSelected).length,
      fundsOriginated: originatedConsumers.length,
      fundsSettled: settledConsumers.length,
      totalAmount,
      originatedAmount,
      settledAmount,
      emailOpenRate: emailsSent > 0 ? (emailsOpened / emailsSent) * 100 : 0,
      linkClickRate: emailsOpened > 0 ? (linksClicked / emailsOpened) * 100 : 0,
      completionRate: campaign.consumers.length > 0 ? (settledConsumers.length / campaign.consumers.length) * 100 : 0
    };
  }
}

export const campaignStore = new CampaignStore();

// Default payment method configurations
export const DEFAULT_PAYMENT_METHODS: PaymentMethodConfig[] = [
  { type: 'prepaid', enabled: true, feeType: 'dollar', feeAmount: 0, displayOrder: 1 },
  { type: 'check', enabled: true, feeType: 'dollar', feeAmount: 0, displayOrder: 2 },
  { type: 'ach', enabled: true, feeType: 'dollar', feeAmount: 0, displayOrder: 3 },
  { type: 'realtime', enabled: true, feeType: 'percentage', feeAmount: 1, displayOrder: 4 },
  { type: 'venmo', enabled: true, feeType: 'dollar', feeAmount: 0, displayOrder: 5 },
  { type: 'paypal', enabled: true, feeType: 'dollar', feeAmount: 0, displayOrder: 6 },
  { type: 'international', enabled: true, feeType: 'dollar', feeAmount: 0, displayOrder: 7 }
];