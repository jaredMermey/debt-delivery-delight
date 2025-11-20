// Entity hierarchy types
export type EntityType = 'root' | 'distributor' | 'customer'

export interface Entity {
  id: string
  name: string
  type: EntityType
  logo: string
  brandColor?: string
  parentEntityId?: string // For customers under distributors
  createdAt: Date
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
  entityId: string
  permissions: string[] // Permission IDs
}

export interface User {
  id: string
  name: string
  email: string
  entityId: string
  roleId: string
  createdAt: Date
}

export interface Campaign {
  id: string
  name: string
  description: string
  bankLogo: string
  entityId: string // The customer entity that owns this campaign
  consumers: Consumer[]
  paymentMethods: PaymentMethodConfig[]
  advertisementImage?: string
  advertisementUrl?: string
  advertisementEnabled: boolean
  createdAt: Date
  status: 'draft' | 'sent' | 'active' | 'completed'
  sentAt?: Date
  totalEmailsSent?: number
  totalEmailsOpened?: number
  totalLinksClicked?: number
  totalFundsSelected?: number
  totalFundsOriginated?: number
  totalFundsSettled?: number
}

export interface PaymentMethodConfig {
  type: PaymentMethodType
  enabled: boolean
  feeType: 'dollar' | 'percentage'
  feeAmount: number
  displayOrder: number
}

export interface Consumer {
  id: string
  name: string
  email: string
  amount: number
}

export type PaymentMethodType = "ach" | "check" | "realtime" | "prepaid" | "venmo" | "paypal" | "international" | "crypto";

export interface PaymentMethodInfo {
  id: PaymentMethodType;
  title: string;
  description: string;
  icon: any;
  benefits: string[];
  estimatedTime: string;
}

export interface ConsumerTracking {
  consumerId: string
  campaignId: string
  emailSent: boolean
  emailSentAt?: Date
  emailOpened: boolean
  emailOpenedAt?: Date
  linkClicked: boolean
  linkClickedAt?: Date
  paymentMethodSelected?: PaymentMethodType
  paymentMethodSelectedAt?: Date
  fundsOriginated: boolean
  fundsOriginatedAt?: Date
  fundsSettled: boolean
  fundsSettledAt?: Date
  status: 'pending' | 'email_sent' | 'email_opened' | 'link_clicked' | 'payment_selected' | 'funds_originated' | 'funds_settled'
  lastActivity?: Date
}

export interface CampaignStats {
  campaignId: string
  totalConsumers: number
  emailsSent: number
  emailsOpened: number
  linksClicked: number
  fundsSelected: number
  fundsOriginated: number
  fundsSettled: number
  totalAmount: number
  originatedAmount: number
  settledAmount: number
  emailOpenRate: number
  linkClickRate: number
  completionRate: number
}