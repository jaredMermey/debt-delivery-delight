import { Campaign, PaymentMethodConfig, Consumer, PaymentMethodType } from '@/types/campaign';

// Mock data store - can be replaced with Supabase later
class CampaignStore {
  private campaigns: Campaign[] = [];

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
}

export const campaignStore = new CampaignStore();

// Default payment method configurations
export const DEFAULT_PAYMENT_METHODS: PaymentMethodConfig[] = [
  { type: 'ach', enabled: true, feeType: 'dollar', feeAmount: 0, displayOrder: 1 },
  { type: 'prepaid', enabled: true, feeType: 'dollar', feeAmount: 0, displayOrder: 2 },
  { type: 'check', enabled: true, feeType: 'dollar', feeAmount: 0, displayOrder: 3 },
  { type: 'realtime', enabled: true, feeType: 'percentage', feeAmount: 1, displayOrder: 4 },
  { type: 'venmo', enabled: true, feeType: 'dollar', feeAmount: 0, displayOrder: 5 },
  { type: 'paypal', enabled: true, feeType: 'dollar', feeAmount: 0, displayOrder: 6 },
  { type: 'international', enabled: true, feeType: 'dollar', feeAmount: 0, displayOrder: 7 }
];