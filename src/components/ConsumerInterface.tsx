import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, Mail, MapPin, CreditCard, Zap, Wallet, Banknote, Globe } from "lucide-react";
import { ACHFlow } from "@/components/ACHFlow";
import { CheckFlow } from "@/components/CheckFlow";
import { RealTimeFlow } from "@/components/RealTimeFlow";
import { PrepaidFlow } from "@/components/PrepaidFlow";
import { VenmoFlow } from "@/components/VenmoFlow";
import { PayPalFlow } from "@/components/PayPalFlow";
import { PayPalCompletionScreen } from "@/components/PayPalCompletionScreen";
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

const PAYMENT_METHOD_ICONS = {
  ach: Building2,
  prepaid: CreditCard,
  check: MapPin,
  realtime: Zap,
  venmo: Wallet,
  paypal: Banknote,
  international: Globe
};

const PAYMENT_METHOD_TITLES = {
  ach: "Bank Transfer (ACH)",
  prepaid: "Prepaid Card",
  check: "Check by Mail",
  realtime: "Real Time Payment",
  venmo: "Venmo",
  paypal: "PayPal",
  international: "International Bank Account"
};

const PAYMENT_METHOD_DESCRIPTIONS = {
  ach: "Direct deposit to your bank account",
  prepaid: "Funds loaded onto a new prepaid debit card",
  check: "Physical check delivered to your address",
  realtime: "Instant transfer to your bank account",
  venmo: "Receive funds to your Venmo account",
  paypal: "Transfer to your PayPal balance",
  international: "Cross-border transfer to an international account"
};

const PAYMENT_METHOD_BENEFITS = {
  ach: ["Instant setup", "Most secure", "No fees"],
  prepaid: ["No bank account needed", "ATM access", "Online purchases"],
  check: ["No bank account needed", "Traditional method", "Paper trail"],
  realtime: ["Instant transfer", "Same-day availability", "Real-time notifications"],
  venmo: ["Popular and easy", "Quick transfers", "No bank needed"],
  paypal: ["Widely accepted", "Buyer protection", "No card required"],
  international: ["Global reach", "Secure transfer", "SWIFT/IBAN supported"]
};

const PAYMENT_METHOD_TIMES = {
  ach: "2-3 business days",
  prepaid: "Immediate access to funds; card received in 7-10 days",
  check: "5-7 business days",
  realtime: "Within minutes",
  venmo: "Minutes to hours",
  paypal: "Minutes to hours",
  international: "2-5 business days"
};

interface ConsumerInterfaceProps {
  campaign: Campaign;
}

export function ConsumerInterface({ campaign }: ConsumerInterfaceProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [showPrepaidMarketing, setShowPrepaidMarketing] = useState(false);

  // Filter enabled payment methods
  const enabledMethods = campaign.paymentMethods
    .filter(pm => pm.enabled)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // Convert to payment method format expected by existing components
  const paymentMethods = enabledMethods.map(pm => {
    const config = campaign.paymentMethods.find(c => c.type === pm.type)!;
    let benefits = [...PAYMENT_METHOD_BENEFITS[pm.type]];
    
    // Update benefits based on fees
    if (config.feeAmount > 0) {
      const feeText = config.feeType === 'dollar' 
        ? `$${config.feeAmount.toFixed(2)} fee`
        : `${config.feeAmount}% fee`;
      benefits = benefits.filter(b => !b.toLowerCase().includes('no fee'));
      benefits.push(feeText);
    } else {
      benefits = benefits.filter(b => !b.toLowerCase().includes('fee'));
      benefits.push("No fees");
    }

    return {
      id: pm.type,
      title: PAYMENT_METHOD_TITLES[pm.type],
      description: PAYMENT_METHOD_DESCRIPTIONS[pm.type],
      icon: PAYMENT_METHOD_ICONS[pm.type],
      benefits,
      estimatedTime: PAYMENT_METHOD_TIMES[pm.type]
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
    setShowPrepaidMarketing(false);
    setCurrentStep(2);
  };

  const handleComplete = () => {
    setIsComplete(true);
    setCurrentStep(3);
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
          bankLogo={campaign.bankLogo}
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
            {campaign.advertisementEnabled && campaign.advertisementImage && (
              <div className="cursor-pointer" onClick={() => campaign.advertisementUrl && window.open(campaign.advertisementUrl, '_blank')}>
                <ClassActionAdCard 
                  image={campaign.advertisementImage}
                  clickable={!!campaign.advertisementUrl}
                />
              </div>
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
            {selectedMethod === "international" && (
              <div className="rounded-lg border border-slate-200 p-4 text-slate-700">
                International bank transfer selected. We'll guide you through this method soon.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}