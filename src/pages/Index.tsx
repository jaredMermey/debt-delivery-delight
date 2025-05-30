
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Building2, Mail, MapPin, CreditCard, CheckCircle } from "lucide-react";
import { ACHFlow } from "@/components/ACHFlow";
import { CheckFlow } from "@/components/CheckFlow";
import { ZelleFlow } from "@/components/ZelleFlow";
import { PrepaidFlow } from "@/components/PrepaidFlow";

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
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-lg border-gray-200">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl text-slate-800 font-bold">Setup Complete!</CardTitle>
            <CardDescription className="text-lg text-slate-600">
              Your settlement payment method has been configured successfully.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-6">
              You'll receive your settlement funds via your selected method. 
              Keep an eye out for updates on your payment status.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Start Over
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            Hi [Name], How Do You Want to Get Paid?
          </h1>
          <p className="text-slate-600 text-lg font-medium">
            Choose how you'd like to receive your settlement funds
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-600 mb-2 font-medium">
            <span>Step {currentStep} of 3</span>
            <span>{Math.round(getProgressValue())}% Complete</span>
          </div>
          <Progress value={getProgressValue()} className="h-3 bg-gray-200" />
        </div>

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
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <Card 
                  key={method.id}
                  className="cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 border-2 hover:border-emerald-400 bg-white shadow-md"
                  onClick={() => handleMethodSelect(method.id)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl text-slate-800 font-bold">{method.title}</CardTitle>
                        <CardDescription className="text-sm text-slate-600 font-medium">
                          {method.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-slate-600 font-medium">
                        <strong className="text-slate-700">Estimated time:</strong> {method.estimatedTime}
                      </div>
                      <div className="space-y-1">
                        {method.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center text-sm text-emerald-700 font-medium">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
