import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Building2, CreditCard, MapPin, Zap, Wallet, Banknote, Globe, Bitcoin } from "lucide-react";
import { Campaign, PaymentMethodConfig, PaymentMethodType } from "@/types/campaign";

const PAYMENT_METHOD_INFO = {
  ach: { title: "Bank Transfer (ACH)", icon: Building2, description: "Direct deposit to bank account" },
  prepaid: { title: "Prepaid Card", icon: CreditCard, description: "Funds loaded onto prepaid card" },
  check: { title: "Check by Mail", icon: MapPin, description: "Physical check delivered by mail" },
  realtime: { title: "Real Time Payment", icon: Zap, description: "Instant transfer to bank account" },
  venmo: { title: "Venmo", icon: Wallet, description: "Transfer to Venmo account" },
  paypal: { title: "PayPal", icon: Banknote, description: "Transfer to PayPal balance" },
  international: { title: "International Bank Account", icon: Globe, description: "Cross-border bank transfer" },
  crypto: { title: "Cryptocurrency", icon: Bitcoin, description: "Receive funds in Bitcoin, Ethereum, or stablecoins" }
};

interface PaymentMethodsStepProps {
  data: Partial<Campaign>;
  onUpdate: (updates: Partial<Campaign>) => void;
}

export function PaymentMethodsStep({ data, onUpdate }: PaymentMethodsStepProps) {
  const paymentMethods = data.campaign_payment_methods || [];

  const updatePaymentMethod = (type: PaymentMethodType, updates: Partial<PaymentMethodConfig>) => {
    const updatedMethods = paymentMethods.map(pm => 
      pm.type === type ? { ...pm, ...updates } : pm
    );
    onUpdate({ campaign_payment_methods: updatedMethods });
  };

  const enabledCount = paymentMethods.filter(pm => pm.enabled).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-foreground">Payment Methods Configuration</CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose which payment methods consumers can use and configure any fees.
          {enabledCount > 0 && (
            <span className="ml-2 font-medium text-emerald-600">
              {enabledCount} method{enabledCount !== 1 ? 's' : ''} enabled
            </span>
          )}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {paymentMethods.map((method) => {
            const info = PAYMENT_METHOD_INFO[method.type];
            const IconComponent = info.icon;
            
            return (
              <div 
                key={method.type} 
                className={`border rounded-lg p-4 transition-all ${
                  method.enabled 
                    ? 'border-emerald-200 bg-emerald-50/50' 
                    : 'border-border bg-muted/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      method.enabled ? 'bg-emerald-100' : 'bg-muted'
                    }`}>
                      <IconComponent className={`w-5 h-5 ${
                        method.enabled ? 'text-emerald-600' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{info.title}</h4>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </div>
                  </div>
                  
                  <Switch
                    checked={method.enabled}
                    onCheckedChange={(enabled) => updatePaymentMethod(method.type, { enabled })}
                  />
                </div>

                {method.enabled && (
                  <div className="mt-4 pt-4 border-t border-emerald-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Fee Type</Label>
                        <RadioGroup
                          value={method.fee_type}
                          onValueChange={(fee_type: 'dollar' | 'percentage') => 
                            updatePaymentMethod(method.type, { fee_type })
                          }
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="dollar" id={`${method.type}-dollar`} />
                            <Label htmlFor={`${method.type}-dollar`} className="text-sm">
                              Dollar Amount
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="percentage" id={`${method.type}-percentage`} />
                            <Label htmlFor={`${method.type}-percentage`} className="text-sm">
                              Percentage
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Fee Amount
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                            {method.feeType === 'dollar' ? '$' : '%'}
                          </span>
                          <Input
                            type="number"
                            min="0"
                            step={method.feeType === 'dollar' ? '0.01' : '0.1'}
                            value={method.feeAmount}
                            onChange={(e) => updatePaymentMethod(method.type, { 
                              feeAmount: parseFloat(e.target.value) || 0 
                            })}
                            className="pl-8"
                            placeholder={method.feeType === 'dollar' ? '0.00' : '0.0'}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Fee Preview</Label>
                        <div className="text-sm text-muted-foreground bg-muted/50 rounded p-2">
                          {method.feeAmount > 0 ? (
                            <>
                              On $100: Consumer pays{" "}
                              <span className="font-medium text-foreground">
                                {method.feeType === 'dollar' 
                                  ? `$${method.feeAmount.toFixed(2)}`
                                  : `$${(100 * method.feeAmount / 100).toFixed(2)}`
                                }
                              </span>{" "}
                              fee, receives{" "}
                              <span className="font-medium text-foreground">
                                {method.feeType === 'dollar'
                                  ? `$${(100 - method.feeAmount).toFixed(2)}`
                                  : `$${(100 - (100 * method.feeAmount / 100)).toFixed(2)}`
                                }
                              </span>
                            </>
                          ) : (
                            "No fees"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {enabledCount === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Please enable at least one payment method to continue.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}