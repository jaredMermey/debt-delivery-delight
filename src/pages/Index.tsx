import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, Mail, MapPin, CreditCard, Zap, Wallet, Banknote, Globe } from "lucide-react";
import { ACHFlow } from "@/components/ACHFlow";
import { CheckFlow } from "@/components/CheckFlow";
import { RealTimeFlow } from "@/components/RealTimeFlow";
import { PrepaidFlow } from "@/components/PrepaidFlow";
import { VenmoFlow } from "@/components/VenmoFlow";
import { PayPalFlow } from "@/components/PayPalFlow";
import { PrepaidMarketingPage } from "@/components/PrepaidMarketingPage";
import { PaymentMethodCard } from "@/components/PaymentMethodCard";
import { CompletionScreen } from "@/components/CompletionScreen";
import { ProgressHeader } from "@/components/ProgressHeader";
import { ACHCompletionScreen } from "@/components/ACHCompletionScreen";
import { CheckCompletionScreen } from "@/components/CheckCompletionScreen";
import { RealTimeCompletionScreen } from "@/components/RealTimeCompletionScreen";
import { PrepaidCompletionScreen } from "@/components/PrepaidCompletionScreen";

type PaymentMethod = "ach" | "check" | "realtime" | "prepaid" | "venmo" | "paypal" | "international" | null;

const Index = () => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [showPrepaidMarketing, setShowPrepaidMarketing] = useState(false);

  const paymentMethods = [
    {
      id: "ach" as const,
      title: "Bank Transfer (ACH)",
      description: "Direct deposit to your bank account",
      icon: Building2,
      benefits: ["Instant setup", "Most secure", "No fees"],
      estimatedTime: "2-3 business days"
    },
    {
      id: "prepaid" as const,
      title: "Prepaid Card",
      description: "Funds loaded onto a new prepaid debit card",
      icon: CreditCard,
      benefits: ["No bank account needed", "ATM access", "Online purchases"],
      estimatedTime: "Immediate access to funds; card received in 7-10 days"
    },
    {
      id: "check" as const,
      title: "Check by Mail",
      description: "Physical check delivered to your address",
      icon: MapPin,
      benefits: ["No bank account needed", "Traditional method", "Paper trail"],
      estimatedTime: "5-7 business days"
    },
    {
      id: "realtime" as const,
      title: "Real Time Payment (1% Fee)",
      description: "Instant transfer to your bank account",
      icon: Zap,
      benefits: ["Instant transfer", "Same-day availability", "Real-time notifications"],
      estimatedTime: "Within minutes"
    },
    {
      id: "venmo" as const,
      title: "Venmo",
      description: "Receive funds to your Venmo account",
      icon: Wallet,
      benefits: ["Popular and easy", "Quick transfers", "No bank needed"],
      estimatedTime: "Minutes to hours"
    },
    {
      id: "paypal" as const,
      title: "PayPal",
      description: "Transfer to your PayPal balance",
      icon: Banknote,
      benefits: ["Widely accepted", "Buyer protection", "No card required"],
      estimatedTime: "Minutes to hours"
    },
    {
      id: "international" as const,
      title: "International Bank Account",
      description: "Cross-border transfer to an international account",
      icon: Globe,
      benefits: ["Global reach", "Secure transfer", "SWIFT/IBAN supported"],
      estimatedTime: "2-5 business days"
    }
  ];

  const handleMethodSelect = (method: PaymentMethod) => {
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
        return <CompletionScreen onComplete={() => {}} />;
      default:
        return <ACHCompletionScreen onComplete={() => {}} />;
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ProgressHeader currentStep={currentStep} progressValue={getProgressValue()} />

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
            {selectedMethod === "venmo" && (
              <VenmoFlow onComplete={handleComplete} />
            )}
{selectedMethod === "paypal" && (
  <PayPalFlow />
)}
            {selectedMethod === "international" && (
              <div className="rounded-lg border border-slate-200 p-4 text-slate-700">
                International bank transfer selected. We’ll guide you through this method soon.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
