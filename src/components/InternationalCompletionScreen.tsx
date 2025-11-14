import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Globe, Clock } from "lucide-react";

interface InternationalCompletionScreenProps {
  onComplete: () => void;
}

export const InternationalCompletionScreen = ({ onComplete }: InternationalCompletionScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-slate-200 shadow-lg">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Success Icon */}
            <div className="relative">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            {/* Success Message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">
                International Transfer Confirmed!
              </h1>
              <p className="text-slate-600">
                Your payment will be sent to your international bank account
              </p>
            </div>

            {/* Timeline Box */}
            <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium text-blue-900">Expected Timeline</p>
                  <p className="text-sm text-blue-800 mt-1">
                    Transfers typically complete within 2-5 business days depending on the destination country
                  </p>
                </div>
              </div>
            </div>

            {/* Confirmation Details */}
            <div className="w-full space-y-3 pt-2">
              <div className="flex items-start space-x-3 text-left">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Bank account details verified</p>
                  <p className="text-xs text-slate-600 mt-0.5">Your information has been securely processed</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-left">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-900">You will receive updates as funds are processed</p>
                  <p className="text-xs text-slate-600 mt-0.5">We'll notify you at each stage of the transfer</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-left">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-900">International transfer initiated</p>
                  <p className="text-xs text-slate-600 mt-0.5">Processing through secure international banking network</p>
                </div>
              </div>
            </div>

            {/* Security Note */}
            <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-left">
              <p className="text-xs text-slate-600">
                <span className="font-semibold text-slate-900">Secure Transfer:</span> All international transfers are processed through secure banking channels with full encryption and compliance with international banking regulations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
