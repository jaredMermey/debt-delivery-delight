
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CreditCard, Shield, User, FileText, Camera, CheckCircle } from "lucide-react";

interface PrepaidFlowProps {
  onComplete: () => void;
}

export const PrepaidFlow = ({ onComplete }: PrepaidFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [kycData, setKycData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    ssn: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    idType: "",
    idNumber: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setKycData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return kycData.firstName && kycData.lastName && kycData.dateOfBirth && kycData.ssn;
      case 2:
        return kycData.address && kycData.city && kycData.state && kycData.zipCode;
      case 3:
        return kycData.idType && kycData.idNumber;
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

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepProgress = () => (currentStep / 4) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <CardTitle className="text-2xl">Prepaid Card Setup</CardTitle>
            <p className="text-gray-600">Complete verification to get your prepaid card</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-5 h-5 text-orange-600" />
            <span className="font-semibold text-orange-900">Secure KYC Process</span>
          </div>
          <p className="text-sm text-orange-800">
            We need to verify your identity to comply with federal regulations and issue your prepaid card.
            Your information is encrypted and secure.
          </p>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep} of 4</span>
            <span>{Math.round(getStepProgress())}% Complete</span>
          </div>
          <Progress value={getStepProgress()} className="h-2" />
        </div>

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Personal Information</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={kycData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={kycData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={kycData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="ssn">Social Security Number *</Label>
                <Input
                  id="ssn"
                  value={kycData.ssn}
                  onChange={(e) => handleInputChange('ssn', e.target.value)}
                  placeholder="XXX-XX-XXXX"
                  maxLength={11}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Address Information */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Address Information</h3>
            </div>
            
            <div>
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                value={kycData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Main Street, Apt 4B"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={kycData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="City"
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={kycData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="State"
                />
              </div>
            </div>

            <div className="w-1/2">
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                value={kycData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                placeholder="12345"
              />
            </div>
          </div>
        )}

        {/* Step 3: ID Verification */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Camera className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Identity Verification</h3>
            </div>

            <div>
              <Label htmlFor="idType">ID Type *</Label>
              <select
                id="idType"
                value={kycData.idType}
                onChange={(e) => handleInputChange('idType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select ID Type</option>
                <option value="drivers_license">Driver's License</option>
                <option value="state_id">State ID</option>
                <option value="passport">Passport</option>
              </select>
            </div>

            <div>
              <Label htmlFor="idNumber">ID Number *</Label>
              <Input
                id="idNumber"
                value={kycData.idNumber}
                onChange={(e) => handleInputChange('idNumber', e.target.value)}
                placeholder="Enter your ID number"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Camera className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Document Upload Required</span>
              </div>
              <p className="text-sm text-blue-800 mb-3">
                You'll need to upload a clear photo of your ID in the next step.
              </p>
              <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
                <Camera className="w-4 h-4 mr-2" />
                Prepare to Upload ID Photo
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Complete */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold">Review & Complete</h3>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Name:</span><br />
                  {kycData.firstName} {kycData.lastName}
                </div>
                <div>
                  <span className="font-semibold">Date of Birth:</span><br />
                  {kycData.dateOfBirth}
                </div>
                <div>
                  <span className="font-semibold">Address:</span><br />
                  {kycData.address}<br />
                  {kycData.city}, {kycData.state} {kycData.zipCode}
                </div>
                <div>
                  <span className="font-semibold">ID Type:</span><br />
                  {kycData.idType.replace('_', ' ').toUpperCase()}
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900">Prepaid Card Details</span>
              </div>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Card will be shipped to your verified address</li>
                <li>• Funds will be loaded upon settlement approval</li>
                <li>• ATM access and online purchases available</li>
                <li>• Expected delivery: 7-10 business days</li>
              </ul>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex space-x-4">
          {currentStep > 1 && (
            <Button 
              variant="outline" 
              onClick={prevStep}
              className="flex-1"
            >
              Previous
            </Button>
          )}
          <Button 
            onClick={nextStep}
            disabled={!isStepValid(currentStep)}
            className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300"
          >
            {currentStep === 4 ? "Complete Setup" : "Continue"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
