
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mail, Phone, Smartphone, CheckCircle, Send } from "lucide-react";

interface ZelleFlowProps {
  onComplete: () => void;
}

export const ZelleFlow = ({ onComplete }: ZelleFlowProps) => {
  const [contactMethod, setContactMethod] = useState<"email" | "phone">("email");
  const [contactInfo, setContactInfo] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string) => {
    return /^\d{10}$/.test(phone.replace(/\D/g, ''));
  };

  const isContactValid = contactMethod === "email" 
    ? isValidEmail(contactInfo) 
    : isValidPhone(contactInfo);

  const handleSendVerification = async () => {
    if (!isContactValid) return;
    
    setIsVerifying(true);
    // Simulate sending verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsVerifying(false);
  };

  const handleVerifyCode = async () => {
    if (verificationCode === "123456") {
      setIsVerified(true);
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-2xl">Zelle Transfer Setup</CardTitle>
            <p className="text-gray-600">Verify your email or phone number</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Smartphone className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-purple-900">Fast & Secure</span>
          </div>
          <p className="text-sm text-purple-800">
            Zelle transfers typically arrive within minutes. Your contact information 
            must be registered with a participating bank.
          </p>
        </div>

        {!isVerifying && !isVerified && (
          <>
            <div className="space-y-4">
              <Label className="text-base font-semibold">How would you like to receive your Zelle transfer?</Label>
              <RadioGroup 
                value={contactMethod} 
                onValueChange={(value: "email" | "phone") => {
                  setContactMethod(value);
                  setContactInfo("");
                }}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="email" id="email" />
                  <Mail className="w-5 h-5 text-blue-600" />
                  <Label htmlFor="email" className="flex-1 cursor-pointer">
                    Email Address
                    <div className="text-sm text-gray-500">Send to your email registered with Zelle</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="phone" id="phone" />
                  <Phone className="w-5 h-5 text-green-600" />
                  <Label htmlFor="phone" className="flex-1 cursor-pointer">
                    Phone Number
                    <div className="text-sm text-gray-500">Send to your mobile number registered with Zelle</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="contact">
                {contactMethod === "email" ? "Email Address" : "Phone Number"} *
              </Label>
              <Input
                id="contact"
                type={contactMethod === "email" ? "email" : "tel"}
                value={contactInfo}
                onChange={(e) => {
                  const value = contactMethod === "phone" 
                    ? formatPhoneNumber(e.target.value)
                    : e.target.value;
                  setContactInfo(value);
                }}
                placeholder={contactMethod === "email" 
                  ? "your.email@example.com" 
                  : "(555) 123-4567"
                }
                className="mt-1"
              />
              {contactInfo && !isContactValid && (
                <p className="text-sm text-red-600 mt-1">
                  Please enter a valid {contactMethod === "email" ? "email address" : "phone number"}
                </p>
              )}
            </div>

            <Button 
              onClick={handleSendVerification}
              disabled={!isContactValid}
              className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg disabled:bg-gray-300"
            >
              <Send className="w-5 h-5 mr-2" />
              Send Verification Code
            </Button>
          </>
        )}

        {isVerifying && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-purple-600 animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Sending Verification Code</h3>
            <p className="text-gray-600">
              We're sending a verification code to{" "}
              {contactMethod === "email" ? contactInfo : contactInfo}
            </p>
          </div>
        )}

        {!isVerifying && !isVerified && contactInfo && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="verification">Verification Code</Label>
              <Input
                id="verification"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
              <p className="text-xs text-gray-500 text-center">
                Enter "123456" for demo purposes
              </p>
            </div>
            <Button 
              onClick={handleVerifyCode}
              disabled={verificationCode.length !== 6}
              className="w-full mt-4 bg-green-600 hover:bg-green-700"
            >
              Verify & Complete Setup
            </Button>
          </div>
        )}

        {isVerified && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-green-700 mb-2">Verified Successfully!</h3>
            <p className="text-gray-600">
              Your Zelle information has been confirmed. Settlement funds will be sent to{" "}
              {contactMethod === "email" ? contactInfo : contactInfo}
            </p>
          </div>
        )}

        <div className="bg-amber-50 p-4 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Your {contactMethod} must be enrolled with Zelle through a participating bank. 
            If you're not enrolled, you'll receive instructions on how to claim your payment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
