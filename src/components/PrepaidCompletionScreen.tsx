
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle, Clock, Download } from "lucide-react";

interface PrepaidCompletionScreenProps {
  onComplete: () => void;
}

export const PrepaidCompletionScreen = ({ onComplete }: PrepaidCompletionScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-xl border-0">
        <CardContent className="p-8">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-10 h-10 text-emerald-600" />
          </div>
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Prepaid Card is Loaded!</h1>
            <p className="text-gray-600">
              Add virtual card to phone for immediate use. Your physical card will be shipped to you.
            </p>
          </div>

          {/* Prepaid Card Image Section */}
          <div className="mb-6 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=300&h=200&fit=crop&crop=center" 
              alt="Prepaid Card"
              className="w-48 h-32 object-cover rounded-lg shadow-md"
            />
          </div>

          <div className="bg-emerald-50 p-4 rounded-lg mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold text-emerald-900">Delivery Timeline</span>
            </div>
            <p className="text-sm text-emerald-800">
              Your card will arrive in 7-10 business days.
            </p>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Identity verified and approved</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Card shipping to verified address</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Works anywhere Visa is accepted</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg">
              <Download className="w-5 h-5 mr-2" />
              Download Mobile App for Prepaid Card
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
