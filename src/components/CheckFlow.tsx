
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Mail, CheckCircle } from "lucide-react";

interface CheckFlowProps {
  onComplete: () => void;
}

export const CheckFlow = ({ onComplete }: CheckFlowProps) => {
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    fullName: ""
  });
  const [isValid, setIsValid] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    const newAddress = { ...address, [field]: value };
    setAddress(newAddress);
    
    // Check if all required fields are filled
    const required = ['street', 'city', 'state', 'zipCode', 'fullName'];
    setIsValid(required.every(field => newAddress[field as keyof typeof newAddress].trim() !== ''));
  };

  const handleConfirm = () => {
    if (isValid) {
      onComplete();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Mail className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-2xl">Check by Mail Setup</CardTitle>
            <p className="text-gray-600">Provide your mailing address</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Mail className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-900">Secure Mail Delivery</span>
          </div>
          <p className="text-sm text-blue-800">
            Your settlement check will be sent via certified mail with tracking information.
            Expected delivery: 5-7 business days.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name (as it appears on ID) *</Label>
            <Input
              id="fullName"
              value={address.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Enter your full legal name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="street">Street Address *</Label>
            <Input
              id="street"
              value={address.street}
              onChange={(e) => handleInputChange('street', e.target.value)}
              placeholder="Enter your street address"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={address.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="City"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={address.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="State"
                className="mt-1"
              />
            </div>
          </div>

          <div className="w-1/2">
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              id="zipCode"
              value={address.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              placeholder="12345"
              className="mt-1"
            />
          </div>
        </div>

        {/* Mock Map Visualization */}
        {address.street && address.city && address.state && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center space-x-2 mb-3">
              <MapPin className="w-5 h-5 text-green-600" />
              <span className="font-semibold">Address Verification</span>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-blue-100 h-32 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-gradient-to-r from-green-200 via-blue-200 to-green-200"></div>
              </div>
              <div className="relative z-10 text-center">
                <MapPin className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-700">
                  {address.street}
                  <br />
                  {address.city}, {address.state} {address.zipCode}
                </div>
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              Address appears valid for mail delivery
            </div>
          </div>
        )}

        <div className="bg-amber-50 p-4 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Important:</strong> Please ensure your address is correct and that you can receive certified mail at this location. 
            The check will be made out to the name provided above.
          </p>
        </div>

        <Button 
          onClick={handleConfirm}
          disabled={!isValid}
          className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg disabled:bg-gray-300"
        >
          Confirm Mailing Address
        </Button>
      </CardContent>
    </Card>
  );
};
