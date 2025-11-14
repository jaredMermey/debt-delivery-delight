
import { Card, CardContent } from "@/components/ui/card";
import { Mail, CheckCircle, Clock } from "lucide-react";

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
              Your check is in route to your confirmed address
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg mb-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-900">Delivery Timeline</span>
            </div>
            <p className="text-sm text-green-800 text-center">
              Your check will be sent via certified mail and should arrive within 5-7 business days after approval.
            </p>
          </div>

          <div className="space-y-3">
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

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-600">
              Think about renewing your policy?{" "}
              <a 
                href="https://coterieinsurance.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 underline"
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
