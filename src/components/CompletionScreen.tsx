
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import coterieCardLogo from "@/assets/coterie-card-logo.png";

interface CompletionScreenProps {
  onComplete: () => void;
}

export const CompletionScreen = ({ onComplete }: CompletionScreenProps) => {
  const isMobile = useIsMobile();

  // Detect platform for wallet buttons
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-lg border-gray-200">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl text-slate-800 font-bold">Setup Complete!</CardTitle>
          <CardDescription className="text-lg text-slate-600">
            Your payment method has been configured successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-slate-600 mb-6">
            You'll receive your funds via your selected method. 
            Keep an eye out for updates on your payment status.
          </p>
          
          {/* Card Image */}
          <div className="flex justify-center mb-6">
            <div className="w-64 h-40 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] rounded-xl shadow-lg relative overflow-hidden">
              <img 
                src={coterieCardLogo} 
                alt="Coterie" 
                className="absolute top-4 right-4 h-5 w-auto opacity-90"
              />
              <div className="absolute bottom-4 left-4 text-white">
                <div className="text-xs opacity-80">**** **** **** 1234</div>
                <div className="text-xs opacity-80 mt-1">Valid Thru 12/27</div>
              </div>
              <div className="absolute top-4 left-4 w-8 h-8 bg-white rounded opacity-20"></div>
              <div className="absolute bottom-4 right-4 text-white text-xs font-bold">COTERIE</div>
            </div>
          </div>

          {/* Wallet Buttons - Only show on mobile */}
          {isMobile && (isIOS || isAndroid) && (
            <div className="space-y-3 mb-6">
              {isIOS && (
                <Button 
                  className="w-full bg-black hover:bg-gray-900 text-white font-medium h-12 rounded-lg"
                  onClick={() => console.log('Add to Apple Wallet')}
                >
                  <span className="mr-2">📱</span>
                  Add to Apple Wallet
                </Button>
              )}
              {isAndroid && (
                <Button 
                  className="w-full bg-black hover:bg-gray-900 text-white font-medium h-12 rounded-lg"
                  onClick={() => console.log('Add to Google Wallet')}
                >
                  <span className="mr-2">💳</span>
                  Add to Google Wallet
                </Button>
              )}
            </div>
          )}
          
          {/* Main button for downloading mobile app */}
          <Button 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12"
            onClick={() => console.log('Download mobile app')}
          >
            <Download className="w-5 h-5 mr-2" />
            Download Mobile App
          </Button>
          
          {/* Link button to transaction center */}
          <Button 
            variant="ghost"
            className="w-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-medium"
            onClick={() => console.log('Go to transaction center')}
          >
            Go to Transaction Center
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
