import { useState } from "react";
import { Button } from "@/components/ui/button";
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

type PaymentMethod = "ach" | "check" | "realtime" | "prepaid" | "venmo" | "paypal" | "international" | "crypto" | null;

const Index = () => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [showPrepaidMarketing, setShowPrepaidMarketing] = useState(false);

  const paymentMethods = [
    {
      id: "prepaid" as const,
      title: "Prepaid Card",
      description: "Virtual card ready instantly - use on your phone today",
      icon: CreditCard,
      benefits: ["Instant virtual card for phone spending", "ATM access", "Online purchases"],
      estimatedTime: "Immediate access to funds",
      fee: "No Fee",
      ribbon: "INSTANT"
    },
    {
      id: "check" as const,
      title: "Check by Mail",
      description: "Physical check delivered to your address",
      icon: MapPin,
      benefits: ["No bank account needed", "Traditional method", "Paper trail"],
      estimatedTime: "5-7 business days",
      fee: "No Fee"
    },
    {
      id: "ach" as const,
      title: "Bank Transfer (ACH)",
      description: "Direct deposit to your bank account",
      icon: Building2,
      benefits: ["Instant setup", "Most secure", "No fees"],
      estimatedTime: "2-3 business days",
      fee: "No Fee"
    },
    {
      id: "realtime" as const,
      title: "Real Time Payment",
      description: "Instant transfer to your bank account",
      icon: Zap,
      benefits: ["Instant transfer", "Same-day availability", "Real-time notifications"],
      estimatedTime: "Within minutes",
      fee: "1% Fee"
    },
    {
      id: "venmo" as const,
      title: "Venmo",
      description: "Receive funds to your Venmo account",
      icon: Wallet,
      benefits: ["Popular and easy", "Quick transfers", "No bank needed"],
      estimatedTime: "Next business day",
      fee: "No Fee"
    },
    {
      id: "paypal" as const,
      title: "PayPal",
      description: "Transfer to your PayPal balance",
      icon: Banknote,
      benefits: ["Widely accepted", "Buyer protection", "No card required"],
      estimatedTime: "Next business day",
      fee: "No Fee"
    },
    {
      id: "international" as const,
      title: "International Bank Account",
      description: "Cross-border transfer to an international account",
      icon: Globe,
      benefits: ["Global reach", "Secure transfer", "SWIFT/IBAN supported"],
      estimatedTime: "2-5 business days",
      fee: "No Fee"
    },
    {
      id: "crypto" as const,
      title: "Cryptocurrency",
      description: "Receive your funds in popular cryptocurrencies",
      icon: Bitcoin,
      benefits: ["Choose from Bitcoin, Ethereum, or stablecoins", "Fast international transfers", "Lower international fees"],
      estimatedTime: "Instant after approval",
      fee: "No Fee"
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
    handleComplete();
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
            <ClassActionAdCard />
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
              <PayPalFlow onComplete={handleComplete} />
            )}
            {selectedMethod === "international" && (
              <InternationalFlow onComplete={handleComplete} />
            )}
            {selectedMethod === "crypto" && (
              <CryptoFlow onComplete={handleComplete} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
