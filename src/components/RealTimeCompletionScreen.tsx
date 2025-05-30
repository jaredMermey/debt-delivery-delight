
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, CheckCircle, Clock } from "lucide-react";

interface RealTimeCompletionScreenProps {
  onComplete: () => void;
}

export const RealTimeCompletionScreen = ({ onComplete }: RealTimeCompletionScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-xl border-0">
        <CardContent className="p-8">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-10 h-10 text-orange-600" />
          </div>
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Real Time Payment Setup Complete!</h1>
            <p className="text-gray-600">
              Your bank account has been connected for instant transfers.
            </p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg mb-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-900">Instant Settlement</span>
            </div>
            <p className="text-sm text-orange-800">
              Funds will be transferred instantly to your connected bank account with a 1% fee.
              <br />
              <span className="underline mt-2 inline-block">Available within minutes</span>
            </p>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Bank account verified and connected</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Real-time transfer enabled</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Instant notifications activated</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-lg">
              Go to Disbursement Center
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
