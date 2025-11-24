import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Building2, Mail, MapPin, CreditCard, Zap, Wallet, Banknote, Globe, Bitcoin } from "lucide-react";
import { ACHFlow } from "@/components/ACHFlow";
import { CheckFlow } from "@/components/CheckFlow";
import { RealTimeFlow } from "@/components/RealTimeFlow";
import { PrepaidFlow } from "@/components/PrepaidFlow";
import { VenmoFlow } from "@/components/VenmoFlow";
import { PayPalFlow } from "@/components/PayPalFlow";
import { PayPalCompletionScreen } from "@/components/PayPalCompletionScreen";
import { InternationalFlow } from "@/components/InternationalFlow";
import { InternationalCompletionScreen } from "@/components/InternationalCompletionScreen";
import { CryptoFlow } from "@/components/CryptoFlow";
import { CryptoCompletionScreen } from "@/components/CryptoCompletionScreen";
import { PrepaidMarketingPage } from "@/components/PrepaidMarketingPage";
import { PaymentMethodCard } from "@/components/PaymentMethodCard";
import { CompletionScreen } from "@/components/CompletionScreen";
import { ProgressHeader } from "@/components/ProgressHeader";
import { ACHCompletionScreen } from "@/components/ACHCompletionScreen";
import { CheckCompletionScreen } from "@/components/CheckCompletionScreen";
import { RealTimeCompletionScreen } from "@/components/RealTimeCompletionScreen";
import { PrepaidCompletionScreen } from "@/components/PrepaidCompletionScreen";
import { VenmoCompletionScreen } from "@/components/VenmoCompletionScreen";
import { ClassActionAdCard } from "@/components/ClassActionAdCard";
import { Campaign, PaymentMethodType } from "@/types/campaign";
import { useValidateToken, useMarkTokenUsed } from "@/hooks/useConsumerToken";

const PAYMENT_METHOD_ICONS = {
  ach: Building2,
  prepaid: CreditCard,
  check: MapPin,
  realtime: Zap,
  venmo: Wallet,
  paypal: Banknote,
  zelle: Zap,
  international: Globe,
  crypto: Bitcoin
};

const PAYMENT_METHOD_TITLES = {
  ach: "Bank Transfer (ACH)",
  prepaid: "Prepaid Card",
  check: "Check by Mail",
  realtime: "Real Time Payment",
  venmo: "Venmo",
  paypal: "PayPal",
  zelle: "Zelle",
  international: "International Bank Account",
  crypto: "Cryptocurrency"
};

const PAYMENT_METHOD_DESCRIPTIONS = {
  ach: "Direct deposit to your bank account",
  prepaid: "Virtual card ready instantly - use on your phone today",
  check: "Physical check delivered to your address",
  realtime: "Instant transfer to your bank account",
  venmo: "Receive funds to your Venmo account",
  paypal: "Transfer to your PayPal balance",
  zelle: "Instant transfer via Zelle",
  international: "Cross-border transfer to an international account",
  crypto: "Receive your funds in popular cryptocurrencies"
};

const PAYMENT_METHOD_BENEFITS = {
  ach: ["Instant setup", "Most secure", "No fees"],
  prepaid: ["Instant virtual card for phone spending", "ATM access", "Online purchases"],
  check: ["No bank account needed", "Traditional method", "Paper trail"],
  realtime: ["Instant transfer", "Same-day availability", "Real-time notifications"],
  venmo: ["Popular and easy", "Quick transfers", "No bank needed"],
  paypal: ["Widely accepted", "Buyer protection", "No card required"],
  zelle: ["Instant transfer", "No fees", "Bank integrated"],
  international: ["Global reach", "Secure transfer", "SWIFT/IBAN supported"],
  crypto: ["Choose from Bitcoin, Ethereum, or stablecoins", "Fast international transfers", "Lower international fees", "Full control of your funds"]
};

const PAYMENT_METHOD_TIMES = {
  ach: "2-3 business days",
  prepaid: "Immediate access to funds; card received in 7-10 days",
  check: "5-7 business days",
  realtime: "Within minutes",
  venmo: "Minutes to hours",
  paypal: "Minutes to hours",
  zelle: "Within minutes",
  international: "2-5 business days",
  crypto: "Instant after approval"
};

interface ConsumerInterfaceProps {
  campaign?: Campaign;
}

export function ConsumerInterface({ campaign: propCampaign }: ConsumerInterfaceProps) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [showPrepaidMarketing, setShowPrepaidMarketing] = useState(false);

  // Use token validation hook for non-preview mode
  const { data: tokenData, isLoading: tokenLoading, error: tokenError } = useValidateToken(propCampaign ? undefined : token || undefined);
  const markTokenUsed = useMarkTokenUsed();
  
  // If campaign is passed via props (preview), use it; otherwise use validated token data
  const campaign = propCampaign || tokenData?.campaigns;
  const consumer = propCampaign ? null : tokenData?.consumers;

  // Loading state
  if (!propCampaign && tokenLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Validating your access...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (!propCampaign && (tokenError || !campaign)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">Invalid or Expired Link</h3>
            <p className="text-muted-foreground">
              This payment link is no longer valid. Please contact support for assistance.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!campaign) {
    return null;
  }

  // Filter enabled payment methods
  const enabledMethods = (campaign.campaign_payment_methods || [])
    .filter(pm => pm.enabled)
    .sort((a, b) => a.display_order - b.display_order);

  // Convert to payment method format expected by existing components
  const paymentMethods = enabledMethods.map(pm => {
    const config = (campaign.campaign_payment_methods || []).find(c => c.type === pm.type)!;
    let benefits = [...PAYMENT_METHOD_BENEFITS[pm.type]];
    let fee: string | undefined;
    
    // Update benefits based on fees
    if (config.fee_amount > 0) {
      fee = config.fee_type === 'dollar' 
        ? `$${config.fee_amount.toFixed(2)} Fee`
        : `${config.fee_amount}% Fee`;
      benefits = benefits.filter(b => !b.toLowerCase().includes('no fee'));
    } else {
      benefits = benefits.filter(b => !b.toLowerCase().includes('fee'));
    }

    return {
      id: pm.type,
      title: PAYMENT_METHOD_TITLES[pm.type],
      description: PAYMENT_METHOD_DESCRIPTIONS[pm.type],
      icon: PAYMENT_METHOD_ICONS[pm.type],
      benefits,
      estimatedTime: PAYMENT_METHOD_TIMES[pm.type],
      fee,
      ribbon: pm.type === 'prepaid' ? 'INSTANT' : undefined
    };
  });

  const handleMethodSelect = (method: PaymentMethodType) => {
    setSelectedMethod(method);
    if (method === "prepaid") {
      setShowPrepaidMarketing(true);
      setCurrentStep(2);
    } else {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (showPrepaidMarketing) {
      setShowPrepaidMarketing(false);
      setSelectedMethod(null);
      setCurrentStep(1);
    } else if (currentStep === 2) {
      setSelectedMethod(null);
      setCurrentStep(1);
    }
  };

  const handlePrepaidContinue = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    setIsComplete(true);
    setCurrentStep(3);
    // Mark token as used if not in preview mode
    if (!propCampaign && token) {
      await markTokenUsed.mutateAsync(token);
    }
  };

  const getProgressValue = () => {
    if (isComplete) return 100;
    if (showPrepaidMarketing) return 33;
    return currentStep === 1 ? 33 : 66;
  };

  if (isComplete) {
    switch (selectedMethod) {
      case "ach":
        return <ACHCompletionScreen onComplete={() => {}} />;
      case "check":
        return <CheckCompletionScreen onComplete={() => {}} />;
      case "realtime":
        return <RealTimeCompletionScreen onComplete={() => {}} />;
      case "prepaid":
        return <PrepaidCompletionScreen onComplete={() => {}} />;
      case "venmo":
        return <VenmoCompletionScreen onComplete={() => {}} />;
      case "paypal":
        return <PayPalCompletionScreen onComplete={() => {}} />;
      case "international":
        return <InternationalCompletionScreen onComplete={() => {}} />;
      case "crypto":
        return <CryptoCompletionScreen onComplete={() => {}} />;
      default:
        return <ACHCompletionScreen onComplete={() => {}} />;
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ProgressHeader 
          currentStep={currentStep} 
          progressValue={getProgressValue()} 
          bankLogo={campaign.bank_logo}
        />

        {/* Back Button */}
        {(currentStep === 2 || showPrepaidMarketing) && (
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mb-6 hover:bg-slate-100 text-slate-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Options
          </Button>
        )}

        {/* Method Selection */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentMethods.map((method) => (
              <PaymentMethodCard 
                key={method.id}
                method={method}
                onSelect={handleMethodSelect}
              />
            ))}
            
            {/* Advertisement Card */}
            {campaign.advertisement_enabled && campaign.advertisement_image && (
              <ClassActionAdCard 
                image={campaign.advertisement_image}
                clickable={!!campaign.advertisement_url}
                url={campaign.advertisement_url}
              />
            )}
          </div>
        )}

        {/* Prepaid Marketing Page */}
        {showPrepaidMarketing && (
          <PrepaidMarketingPage 
            onContinue={handlePrepaidContinue}
            onBack={handleBack}
          />
        )}

        {/* Selected Method Flow */}
        {currentStep === 2 && selectedMethod && !showPrepaidMarketing && (
          <div className="max-w-2xl mx-auto">
            {selectedMethod === "ach" && <ACHFlow onComplete={handleComplete} />}
            {selectedMethod === "check" && <CheckFlow onComplete={handleComplete} />}
            {selectedMethod === "realtime" && <RealTimeFlow onComplete={handleComplete} />}
            {selectedMethod === "prepaid" && <PrepaidFlow onComplete={handleComplete} />}
            {selectedMethod === "venmo" && <VenmoFlow onComplete={handleComplete} />}
            {selectedMethod === "paypal" && <PayPalFlow onComplete={handleComplete} />}
            {selectedMethod === "international" && <InternationalFlow onComplete={handleComplete} />}
            {selectedMethod === "crypto" && <CryptoFlow onComplete={handleComplete} />}
          </div>
        )}
      </div>
    </div>
  );
}