
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CreditCard, Shield, User, MapPin, Calendar, Lock, CheckCircle, ArrowRight } from "lucide-react";

interface PrepaidFlowProps {
  onComplete: () => void;
}

export const PrepaidFlow = ({ onComplete }: PrepaidFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    ssn: "",
    address: "",
    city: "",
    state: "",
    zipCode: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return userData.firstName && userData.lastName && userData.email && userData.phone;
      case 2:
        return userData.dateOfBirth && userData.ssn;
      case 3:
        return userData.address && userData.city && userData.state && userData.zipCode;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const getStepProgress = () => (currentStep / 4) * 100;

  const stepTitles = {
    1: "Let's get to know you",
    2: "Verify your identity",
    3: "Where should we send your card?",
    4: "You're all set!"
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            {stepTitles[currentStep as keyof typeof stepTitles]}
          </CardTitle>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${getStepProgress()}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">Step {currentStep} of 4</p>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First name</Label>
                  <Input
                    id="firstName"
                    value={userData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter your first name"
                    className="mt-1 h-12 text-base"
                  />
                </div>
                
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last name</Label>
                  <Input
                    id="lastName"
                    value={userData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter your last name"
                    className="mt-1 h-12 text-base"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    className="mt-1 h-12 text-base"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                    className="mt-1 h-12 text-base"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mt-6">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Your information is secure</p>
                    <p className="text-xs text-blue-700 mt-1">We use bank-level encryption to protect your data</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Identity Verification */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Lock className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Identity verification</span>
                </div>
                <p className="text-sm text-gray-600">
                  We need this information to verify your identity and comply with federal regulations.
                </p>
              </div>

              <div>
                <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">Date of birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={userData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="mt-1 h-12 text-base"
                />
                <p className="text-xs text-gray-500 mt-1">You must be 18 or older</p>
              </div>

              <div>
                <Label htmlFor="ssn" className="text-sm font-medium text-gray-700">Social Security Number</Label>
                <Input
                  id="ssn"
                  value={userData.ssn}
                  onChange={(e) => handleInputChange('ssn', e.target.value)}
                  placeholder="XXX-XX-XXXX"
                  maxLength={11}
                  className="mt-1 h-12 text-base"
                />
                <p className="text-xs text-gray-500 mt-1">We'll never share this with anyone</p>
              </div>
            </div>
          )}

          {/* Step 3: Address */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Shipping address</span>
                </div>
                <p className="text-sm text-gray-600">
                  Where should we send your prepaid card?
                </p>
              </div>

              <div>
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">Street address</Label>
                <Input
                  id="address"
                  value={userData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="123 Main Street"
                  className="mt-1 h-12 text-base"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">City</Label>
                  <Input
                    id="city"
                    value={userData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="City"
                    className="mt-1 h-12 text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="text-sm font-medium text-gray-700">State</Label>
                  <Input
                    id="state"
                    value={userData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="CA"
                    className="mt-1 h-12 text-base"
                  />
                </div>
              </div>

              <div className="w-1/2">
                <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700">ZIP code</Label>
                <Input
                  id="zipCode"
                  value={userData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="12345"
                  className="mt-1 h-12 text-base"
                />
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to your new card!</h3>
                <p className="text-gray-600 mb-6">
                  Your prepaid card is being prepared and will arrive in 7-10 business days.
                </p>
              </div>

              <div className="bg-emerald-50 p-4 rounded-lg text-left">
                <h4 className="font-semibold text-emerald-900 mb-3">What's next?</h4>
                <ul className="space-y-2 text-sm text-emerald-800">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Card will be shipped to {userData.address}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Funds loaded upon settlement approval</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Use anywhere Visa is accepted</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Continue Button */}
          <Button 
            onClick={nextStep}
            disabled={!isStepValid(currentStep)}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold text-base mt-8"
          >
            {currentStep === 4 ? (
              "Complete Setup"
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>

          {currentStep < 4 && (
            <p className="text-center text-xs text-gray-500 mt-4">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
