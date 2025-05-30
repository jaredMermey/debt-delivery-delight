
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle, Clock, Download } from "lucide-react";

interface PrepaidCompletionScreenProps {
  onComplete: () => void;
}

export const PrepaidCompletionScreen = ({ onComplete }: PrepaidCompletionScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-2">
      <Card className="w-full max-w-md text-center shadow-xl border-0">
        <CardContent className="p-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-emerald-600" />
          </div>
          
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Your Prepaid Card is Loaded!</h1>
            <p className="text-sm text-gray-600">
              Your settlement funds are already in your prepaid account.
            </p>
          </div>

          {/* Prepaid Card Image Section - Compact size */}
          <div className="mb-3 flex justify-center">
            <img 
              src="/lovable-uploads/e8dd453b-b08f-4c83-8ca1-ebbc55eb75cf.png" 
              alt="Prepaid Card"
              className="w-full h-40 object-contain"
            />
          </div>

          <div className="bg-emerald-50 p-3 rounded-lg mb-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-900">Delivery Timeline</span>
            </div>
            <p className="text-xs text-emerald-800">
              Your virtual card is immediately available. Your physical card will arrive in 7-10 business days.
            </p>
          </div>

          <div className="space-y-2 mb-5 max-w-xs mx-auto">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-xs text-gray-700 text-left">Identity verified and approved</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-xs text-gray-700 text-left">Card shipping to verified address</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-xs text-gray-700 text-left">Works anywhere Visa is accepted</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-10 text-sm">
              <Download className="w-4 h-4 mr-2" />
              Download Mobile App for Prepaid Card
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
