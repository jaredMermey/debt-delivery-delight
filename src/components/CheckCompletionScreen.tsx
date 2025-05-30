import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, Clock, Truck } from "lucide-react";

interface CheckCompletionScreenProps {
  onComplete: () => void;
}

export const CheckCompletionScreen = ({ onComplete }: CheckCompletionScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-xl border-0">
        <CardContent className="p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-green-600" />
          </div>
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Check is in the Mail!</h1>
            <p className="text-gray-600">
              Your settlement check is in route to your confirmed address
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-900">Delivery Timeline</span>
            </div>
            <p className="text-sm text-green-800">
              Your check will be sent via certified mail and should arrive within 5-7 business days after settlement approval.
            </p>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Mailing address verified</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Certified mail with tracking</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Secure delivery confirmation</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg">
              <Truck className="w-5 h-5 mr-2" />
              Track Your Check
            </Button>
            <Button variant="outline" onClick={onComplete} className="w-full h-12">
              Update Mailing Address
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
