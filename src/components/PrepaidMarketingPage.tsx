
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

interface PrepaidMarketingPageProps {
  onContinue: () => void;
  onBack: () => void;
}

export const PrepaidMarketingPage = ({ onContinue, onBack }: PrepaidMarketingPageProps) => {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-0 shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-10 h-10 text-emerald-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            Get Your Prepaid Card
          </CardTitle>
          <p className="text-lg text-gray-600">
            Instant access to your settlement funds with no bank account required
          </p>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          {/* Key Benefits */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Choose Prepaid?</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-emerald-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">No Bank Account Needed</p>
                  <p className="text-sm text-gray-600">Perfect if you don't have traditional banking</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-emerald-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Instant Virtual Access</p>
                  <p className="text-sm text-gray-600">Use your funds immediately online and in apps</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-emerald-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Works Everywhere</p>
                  <p className="text-sm text-gray-600">Accepted anywhere MasterCard is accepted</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fee Structure */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />
              Fee Structure
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">Activation Fee</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">Fee to Spend</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">ATM Withdrawals</span>
                <span className="font-medium text-gray-900">1 free, then $3.95</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <div>
                  <span className="text-gray-700">Inactivity Fee</span>
                  <p className="text-xs text-gray-500">After 12 months of no activity</p>
                </div>
                <span className="font-medium text-gray-900">$4.95/month</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={onContinue}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg"
            >
              Select Card
            </Button>
            <Button 
              variant="outline" 
              onClick={onBack}
              className="w-full h-12 text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              Back to Payment Options
            </Button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4">
            By continuing, you agree to the prepaid card terms and conditions
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
