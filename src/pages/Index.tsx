
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, Mail, MapPin, CreditCard } from "lucide-react";
import { ACHFlow } from "@/components/ACHFlow";
import { CheckFlow } from "@/components/CheckFlow";
import { ZelleFlow } from "@/components/ZelleFlow";
import { PrepaidFlow } from "@/components/PrepaidFlow";
import { PaymentMethodCard } from "@/components/PaymentMethodCard";
import { CompletionScreen } from "@/components/CompletionScreen";
import { ProgressHeader } from "@/components/ProgressHeader";

type PaymentMethod = "ach" | "check" | "zelle" | "prepaid" | null;

const Index = () => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  const paymentMethods = [
    {
      id: "ach" as const,
      title: "Bank Transfer (ACH)",
      description: "Direct deposit to your bank account - fastest option",
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
      estimatedTime: "7-10 business days"
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
      id: "zelle" as const,
      title: "Zelle Transfer",
      description: "Quick transfer using your email or phone number",
      icon: Mail,
      benefits: ["Quick setup", "Familiar platform", "Real-time notifications"],
      estimatedTime: "Within minutes"
    }
  ];

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setCurrentStep(2);
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setSelectedMethod(null);
      setCurrentStep(1);
    }
  };

  const handleComplete = () => {
    setIsComplete(true);
    setCurrentStep(3);
  };

  const getProgressValue = () => {
    if (isComplete) return 100;
    return currentStep === 1 ? 33 : 66;
  };

  if (isComplete) {
    return <CompletionScreen onComplete={handleComplete} />;
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ProgressHeader currentStep={currentStep} progressValue={getProgressValue()} />

        {/* Back Button */}
        {currentStep === 2 && (
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

        {/* Selected Method Flow */}
        {currentStep === 2 && selectedMethod && (
          <div className="max-w-2xl mx-auto">
            {selectedMethod === "ach" && <ACHFlow onComplete={handleComplete} />}
            {selectedMethod === "check" && <CheckFlow onComplete={handleComplete} />}
            {selectedMethod === "zelle" && <ZelleFlow onComplete={handleComplete} />}
            {selectedMethod === "prepaid" && <PrepaidFlow onComplete={handleComplete} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
