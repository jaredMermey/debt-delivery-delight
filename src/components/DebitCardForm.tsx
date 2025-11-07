import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Shield, CheckCircle } from "lucide-react";

interface DebitCardData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  zipCode: string;
}

interface DebitCardFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: DebitCardData) => void;
}

export const DebitCardForm = ({ isOpen, onClose, onSuccess }: DebitCardFormProps) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [zipCode, setZipCode] = useState("");

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "");
    if (/^\d*$/.test(value) && value.length <= 16) {
      setCardNumber(formatCardNumber(value));
    }
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setExpiryDate(formatExpiryDate(value));
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 4) {
      setCvv(value);
    }
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 5) {
      setZipCode(value);
    }
  };

  const isFormValid = () => {
    return (
      cardNumber.replace(/\s/g, "").length === 16 &&
      expiryDate.length === 5 &&
      cvv.length >= 3 &&
      cardholderName.trim().length > 0 &&
      zipCode.length === 5
    );
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      onSuccess({
        cardNumber: cardNumber.replace(/\s/g, ""),
        expiryDate,
        cvv,
        cardholderName,
        zipCode,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
    setCardholderName("");
    setZipCode("");
    onClose();
  };

  const getCardBrand = () => {
    const number = cardNumber.replace(/\s/g, "");
    if (number.startsWith("4")) return "Visa";
    if (number.startsWith("5")) return "MasterCard";
    return "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center space-x-3 mb-2">
            <CreditCard className="w-6 h-6" />
            <div className="text-xl font-semibold">Add Debit Card</div>
          </div>
          <div className="text-sm opacity-90">
            Enter your debit card details for instant payment
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Cardholder Name */}
          <div>
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
              placeholder="JOHN DOE"
              className="mt-1"
              maxLength={50}
            />
          </div>

          {/* Card Number */}
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <div className="relative">
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className="mt-1 font-mono"
                maxLength={19}
              />
              {getCardBrand() && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-semibold text-gray-500">
                  {getCardBrand()}
                </div>
              )}
            </div>
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                value={expiryDate}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                className="mt-1 font-mono"
                maxLength={5}
              />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                value={cvv}
                onChange={handleCvvChange}
                placeholder="123"
                className="mt-1 font-mono"
                type="password"
                maxLength={4}
              />
            </div>
          </div>

          {/* Billing Zip Code */}
          <div>
            <Label htmlFor="zipCode">Billing ZIP Code</Label>
            <Input
              id="zipCode"
              value={zipCode}
              onChange={handleZipCodeChange}
              placeholder="12345"
              className="mt-1 font-mono"
              maxLength={5}
            />
          </div>

          {/* Security Notice */}
          <div className="flex items-start space-x-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-800">
              <div className="font-semibold mb-1">Secure Payment Processing</div>
              <div>
                Your card information is encrypted and securely processed through Visa Direct or MasterCard Send for instant transfers.
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Confirm Card Details
          </Button>

          <div className="text-xs text-center text-gray-500">
            By confirming, you authorize the payment to be sent to this card
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};