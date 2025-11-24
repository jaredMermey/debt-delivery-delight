import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Campaign, PaymentMethodConfig, PaymentMethodType } from "@/types/campaign";
import { CreditCard } from "lucide-react";

interface PaymentMethodsStepProps {
  data: Partial<Campaign>;
  onUpdate: (updates: Partial<Campaign>) => void;
}

const PAYMENT_METHOD_NAMES: Record<PaymentMethodType, string> = {
  ach: 'Bank Transfer (ACH)',
  check: 'Check by Mail',
  prepaid: 'Prepaid Card',
  realtime: 'Real Time Payment',
  paypal: 'PayPal',
  venmo: 'Venmo',
  zelle: 'Zelle',
  crypto: 'Cryptocurrency',
  international: 'International Wire',
};

export function PaymentMethodsStep({ data, onUpdate }: PaymentMethodsStepProps) {
  const paymentMethods = data.payment_methods || [];

  const updatePaymentMethod = (type: PaymentMethodType, updates: Partial<PaymentMethodConfig>) => {
    const updated = paymentMethods.map(pm => 
      pm.type === type ? { ...pm, ...updates } : pm
    );
    onUpdate({ payment_methods: updated });
  };

  const enabledCount = paymentMethods.filter(pm => pm.enabled).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-foreground flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Methods Configuration
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Enable and configure payment methods available to consumers
        </p>
        <Badge variant="outline" className="w-fit">
          {enabledCount} enabled
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {paymentMethods.map((method) => (
          <Card key={method.type} className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={method.enabled}
                    onCheckedChange={(enabled) => updatePaymentMethod(method.type, { enabled })}
                  />
                  <div>
                    <Label className="text-base font-medium text-foreground">
                      {PAYMENT_METHOD_NAMES[method.type]}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {method.type === 'ach' && 'Direct bank account transfers'}
                      {method.type === 'check' && 'Physical check mailed to consumer'}
                      {method.type === 'prepaid' && 'Prepaid debit card'}
                      {method.type === 'realtime' && 'Instant bank transfer'}
                      {method.type === 'paypal' && 'PayPal account transfer'}
                      {method.type === 'venmo' && 'Venmo account transfer'}
                      {method.type === 'zelle' && 'Zelle instant transfer'}
                      {method.type === 'crypto' && 'Cryptocurrency payment'}
                      {method.type === 'international' && 'International bank wire'}
                    </p>
                  </div>
                </div>
              </div>

              {method.enabled && (
                <div className="pl-10 space-y-4 border-l-2 border-muted">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Fee Type</Label>
                    <RadioGroup
                      value={method.fee_type}
                      onValueChange={(value: 'dollar' | 'percentage') => 
                        updatePaymentMethod(method.type, { fee_type: value })
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dollar" id={`${method.type}-dollar`} />
                        <Label htmlFor={`${method.type}-dollar`} className="font-normal">
                          Fixed Dollar Amount
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="percentage" id={`${method.type}-percentage`} />
                        <Label htmlFor={`${method.type}-percentage`} className="font-normal">
                          Percentage of Amount
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
                        {method.fee_type === 'dollar' ? '$' : '%'}
                      </span>
                      <Input
                        type="number"
                        min="0"
                        step={method.fee_type === 'dollar' ? '0.01' : '0.1'}
                        value={method.fee_amount}
                        onChange={(e) => updatePaymentMethod(method.type, { 
                          fee_amount: parseFloat(e.target.value) || 0 
                        })}
                        className="pl-8"
                        placeholder={method.fee_type === 'dollar' ? '0.00' : '0.0'}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Fee Preview</Label>
                    <div className="text-sm text-muted-foreground bg-muted/50 rounded p-2">
                      {method.fee_amount > 0 ? (
                        <>
                          On $100: Consumer pays{" "}
                          <span className="font-medium text-foreground">
                            {method.fee_type === 'dollar' 
                              ? `$${method.fee_amount.toFixed(2)}`
                              : `$${(100 * method.fee_amount / 100).toFixed(2)}`
                            }
                          </span>{" "}
                          fee, receives{" "}
                          <span className="font-medium text-foreground">
                            {method.fee_type === 'dollar'
                              ? `$${(100 - method.fee_amount).toFixed(2)}`
                              : `$${(100 - (100 * method.fee_amount / 100)).toFixed(2)}`
                            }
                          </span>
                        </>
                      ) : (
                        "No fees"
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
