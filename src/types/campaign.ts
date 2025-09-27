export interface Campaign {
  id: string
  name: string
  description: string
  bankLogo: string
  consumers: Consumer[]
  paymentMethods: PaymentMethodConfig[]
  advertisementImage?: string
  advertisementUrl?: string
  advertisementEnabled: boolean
  createdAt: Date
  status: 'draft' | 'active' | 'completed'
  sentAt?: Date
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

export type PaymentMethodType = "ach" | "check" | "realtime" | "prepaid" | "venmo" | "paypal" | "international";

export interface PaymentMethodInfo {
  id: PaymentMethodType;
  title: string;
  description: string;
  icon: any;
  benefits: string[];
  estimatedTime: string;
}