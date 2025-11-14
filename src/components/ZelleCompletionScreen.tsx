
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, CheckCircle, Zap, Download } from "lucide-react";

interface ZelleCompletionScreenProps {
  onComplete: () => void;
}

export const ZelleCompletionScreen = ({ onComplete }: ZelleCompletionScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-xl border-0">
        <CardContent className="p-8">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Smartphone className="w-10 h-10 text-purple-600" />
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h1 className="text-2xl font-bold text-gray-900">Zelle Transfer Setup Complete!</h1>
            </div>
            <p className="text-gray-600">
              Your contact information has been verified for instant transfers.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-900">Lightning Fast</span>
            </div>
            <p className="text-sm text-purple-800">
              Your payment will be sent via Zelle and typically arrives within minutes after approval.
            </p>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Contact information verified</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Instant transfer enabled</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Real-time notifications</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg">
              <Download className="w-5 h-5 mr-2" />
              Get Zelle App
            </Button>
            <Button variant="outline" onClick={onComplete} className="w-full h-12">
              Manage Zelle Settings
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-600 font-bold">
              Think about renewing your policy?{" "}
              <a 
                href="https://coterieinsurance.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 underline"
              >
                Learn more
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
