import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Users, DollarSign, CreditCard, Image, Mail } from "lucide-react";
import { Campaign } from "@/types/campaign";
import { useNavigate } from "react-router-dom";
import { campaignStore } from "@/lib/campaignStore";

interface ReviewStepProps {
  data: Campaign;
  onComplete: () => void;
}

export function ReviewStep({ data, onComplete }: ReviewStepProps) {
  const navigate = useNavigate();
  const enabledMethods = data.paymentMethods.filter(pm => pm.enabled);
  const totalAmount = data.consumers.reduce((sum, consumer) => sum + consumer.amount, 0);
  const averageAmount = data.consumers.length > 0 ? totalAmount / data.consumers.length : 0;

  const handleSendCampaign = () => {
    // Ensure campaign exists in store before sending
    let campaignId = data.id;
    
    if (!campaignId) {
      // Create campaign if it doesn't exist (user went straight to send without preview)
      const newCampaign = campaignStore.createCampaign({
        name: data.name,
        description: data.description,
        bankLogo: data.bankLogo,
        paymentMethods: data.paymentMethods,
        advertisementImage: data.advertisementImage || '',
        advertisementUrl: data.advertisementUrl || '',
        advertisementEnabled: data.advertisementEnabled ?? true,
        consumers: data.consumers
      });
      campaignId = newCampaign.id;
    }
    
    // Send the campaign and generate tracking data
    const sentCampaign = campaignStore.sendCampaign(campaignId);
    
    if (sentCampaign) {
      // Redirect to reports
      navigate(`/admin/campaign/${campaignId}/reports`);
    } else {
      // Fallback if sending fails
      onComplete();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-foreground flex items-center gap-2">
            <Send className="w-5 h-5" />
            Review & Send Campaign
          </CardTitle>
          <p className="text-muted-foreground">
            Review all campaign details before sending to consumers.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Campaign Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-emerald-200">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{data.consumers.length}</p>
                    <p className="text-sm text-muted-foreground">Consumers</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(totalAmount)}</p>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{enabledMethods.length}</p>
                    <p className="text-sm text-muted-foreground">Payment Methods</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Campaign Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Campaign Details</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium text-foreground">{data.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm text-foreground">{data.description}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Brand Logo</p>
                  {data.bankLogo && (
                    <img src={data.bankLogo} alt="Brand Logo" className="h-8 w-auto" />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Payment Methods</h4>
              <div className="space-y-2">
                {enabledMethods.map((method) => (
                  <div key={method.type} className="flex justify-between items-center">
                    <span className="text-sm text-foreground capitalize">
                      {method.type === 'ach' ? 'Bank Transfer (ACH)' : 
                       method.type === 'realtime' ? 'Real Time Payment' :
                       method.type === 'prepaid' ? 'Prepaid Card' :
                       method.type === 'check' ? 'Check by Mail' :
                       method.type}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {method.feeAmount > 0 
                        ? `${method.feeType === 'dollar' ? '$' : ''}${method.feeAmount}${method.feeType === 'percentage' ? '%' : ''} fee`
                        : 'No fee'
                      }
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Advertisement */}
          {data.advertisementEnabled && data.advertisementImage && (
            <div className="space-y-4">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <Image className="w-4 h-4" />
                Advertisement
              </h4>
              <div className="flex items-start space-x-4">
                <img 
                  src={data.advertisementImage} 
                  alt="Advertisement" 
                  className="w-24 h-24 object-cover rounded-lg border border-border"
                />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Advertisement will appear alongside payment options
                  </p>
                  {data.advertisementUrl && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Links to: {data.advertisementUrl}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Consumer Summary */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Consumer Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Consumers</p>
                <p className="font-medium text-foreground">{data.consumers.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Average Amount</p>
                <p className="font-medium text-foreground">{formatCurrency(averageAmount)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Minimum Amount</p>
                <p className="font-medium text-foreground">
                  {formatCurrency(Math.min(...data.consumers.map(c => c.amount)))}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Maximum Amount</p>
                <p className="font-medium text-foreground">
                  {formatCurrency(Math.max(...data.consumers.map(c => c.amount)))}
                </p>
              </div>
            </div>
          </div>

          {/* Send Button */}
          <div className="pt-6 border-t">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Mail className="w-4 h-4 text-emerald-600" />
                <h5 className="font-medium text-emerald-800">Ready to Send</h5>
              </div>
              <p className="text-sm text-emerald-700">
                Once you send this campaign, consumers will receive email notifications with 
                instructions to claim their settlement payments. This action cannot be undone.
              </p>
            </div>
            
            <Button 
              onClick={handleSendCampaign}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg py-3"
            >
              <Send className="w-5 h-5 mr-2" />
              Send Campaign to {data.consumers.length} Consumers
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}