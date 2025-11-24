// Entity hierarchy types
export type EntityType = 'root' | 'distributor' | 'customer'

export interface Entity {
  id: string
  name: string
  type: EntityType
  logo: string
  brand_color?: string
  parent_entity_id?: string
  created_at: string
  updated_at?: string
}

export interface UserPermission {
  id: string
  name: string
  description: string
  category: 'campaigns' | 'users' | 'reports' | 'settings'
}

export interface UserRole {
  id: string
  name: string
  entity_id: string
  permissions?: string[]
  created_at?: string
}

export interface User {
  id: string
  name: string
  email: string
  entity_id: string
  role_id?: string
  created_at: string
  updated_at?: string
}

export interface Campaign {
  id: string
  name: string
  description: string
  bank_logo: string
  entity_id: string
  consumers?: Consumer[]
  campaign_payment_methods?: PaymentMethodConfig[]
  payment_methods?: PaymentMethodConfig[] // Alias for easier access
  stats?: CampaignStats
  advertisement_image?: string
  advertisement_url?: string
  advertisement_enabled: boolean
  created_at: string
  updated_at?: string
  status: 'draft' | 'sent' | 'active' | 'completed' | 'cancelled'
  sent_at?: string
  total_emails_sent?: number
  total_emails_opened?: number
  total_links_clicked?: number
  total_funds_selected?: number
  total_funds_originated?: number
  total_funds_settled?: number
}

export interface PaymentMethodConfig {
  id?: string
  campaign_id?: string
  type: PaymentMethodType
  enabled: boolean
  fee_type: 'dollar' | 'percentage'
  fee_amount: number
  display_order: number
  created_at?: string
}

export interface Consumer {
  id?: string
  campaign_id?: string
  name: string
  email: string
  amount: number
  created_at?: string
}

export type PaymentMethodType = "ach" | "check" | "realtime" | "prepaid" | "venmo" | "paypal" | "zelle" | "international" | "crypto";

export interface PaymentMethodInfo {
  id: PaymentMethodType;
  title: string;
  description: string;
  icon: any;
  benefits: string[];
  estimatedTime: string;
}

export interface ConsumerTracking {
  id?: string
  consumer_id: string
  campaign_id: string
  email_sent: boolean
  email_sent_at?: string
  email_opened: boolean
  email_opened_at?: string
  link_clicked: boolean
  link_clicked_at?: string
  payment_method_selected?: PaymentMethodType
  payment_method_selected_at?: string
  funds_originated: boolean
  funds_originated_at?: string
  funds_settled: boolean
  funds_settled_at?: string
  status: 'pending' | 'email_sent' | 'email_opened' | 'link_clicked' | 'payment_selected' | 'funds_originated' | 'funds_settled'
  last_activity?: string
  created_at?: string
}

export interface CampaignStats {
  campaign_id: string
  total_consumers: number
  emails_sent: number
  emails_opened: number
  links_clicked: number
  funds_selected: number
  funds_originated: number
  funds_settled: number
  total_amount: number
  originated_amount: number
  settled_amount: number
  email_open_rate: number
  link_click_rate: number
  completion_rate: number
  updated_at?: string
}