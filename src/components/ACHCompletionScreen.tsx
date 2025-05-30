import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, CheckCircle, Clock, Download } from "lucide-react";

interface ACHCompletionScreenProps {
  onComplete: () => void;
}

export const ACHCompletionScreen = ({ onComplete }: ACHCompletionScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-xl border-0">
        <CardContent className="p-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-blue-600" />
          </div>
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Bank Transfer Setup Complete!</h1>
            <p className="text-gray-600">
              Your bank account has been successfully connected for direct deposit.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Settlement Timeline</span>
            </div>
            <p className="text-sm text-blue-800">
              Funds will be deposited directly to your connected bank account within 2-3 business days after settlement approval.
            </p>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Bank account verified and connected</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Secure ACH transfer enabled</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Real-time deposit notifications</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
              <Download className="w-5 h-5 mr-2" />
              Download Banking App
            </Button>
            <Button variant="outline" onClick={onComplete} className="w-full h-12">
              View Transfer Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
