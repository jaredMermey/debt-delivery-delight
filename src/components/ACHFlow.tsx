
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Shield, CheckCircle } from "lucide-react";
import { DebitCardForm } from "./DebitCardForm";

interface ACHFlowProps {
  onComplete: () => void;
}

interface DebitCardInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  zipCode: string;
}

export const ACHFlow = ({ onComplete }: ACHFlowProps) => {
  const [isCardFormOpen, setIsCardFormOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [cardInfo, setCardInfo] = useState<DebitCardInfo | null>(null);

  const handleCardSuccess = (data: DebitCardInfo) => {
    setCardInfo(data);
    setIsConnected(true);
  };

  const getCardBrand = () => {
    if (!cardInfo) return "";
    if (cardInfo.cardNumber.startsWith("4")) return "Visa Direct";
    if (cardInfo.cardNumber.startsWith("5")) return "MasterCard Send";
    return "";
  };

  const handleConfirm = () => {
    onComplete();
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Push to Card Setup</CardTitle>
              <p className="text-gray-600">Add your debit card for instant payment</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isConnected ? (
            <>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Secure Card Processing</span>
                </div>
                <p className="text-sm text-blue-800">
                  Your payment will be processed securely through Visa Direct or MasterCard Send 
                  for instant delivery to your debit card.
                </p>
              </div>

              <div className="text-center py-8">
                <Button 
                  onClick={() => setIsCardFormOpen(true)}
                  className="w-full max-w-sm bg-blue-600 hover:bg-blue-700 h-12 text-lg"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Add Debit Card
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Visa Direct & MasterCard Send - Instant push-to-card payments
              </div>
            </>
          ) : (
            <>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-900">Debit Card Added</span>
                </div>
              </div>

              {cardInfo && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Cardholder Name</Label>
                      <Input value={cardInfo.cardholderName} readOnly className="bg-gray-50" />
                    </div>
                    <div>
                      <Label>Card Type</Label>
                      <Input value={getCardBrand()} readOnly className="bg-gray-50" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Card Number</Label>
                      <Input value={`**** **** **** ${cardInfo.cardNumber.slice(-4)}`} readOnly className="bg-gray-50" />
                    </div>
                    <div>
                      <Label>Expiry</Label>
                      <Input value={cardInfo.expiryDate} readOnly className="bg-gray-50" />
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Funds will be sent directly to your debit card.</strong>
                  <br />
                  Expected delivery: Within 30 minutes via {getCardBrand()}.
                </p>
              </div>

              <Button 
                onClick={handleConfirm}
                className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
              >
                Confirm Debit Card
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <DebitCardForm
        isOpen={isCardFormOpen}
        onClose={() => setIsCardFormOpen(false)}
        onSuccess={handleCardSuccess}
      />
    </>
  );
};
