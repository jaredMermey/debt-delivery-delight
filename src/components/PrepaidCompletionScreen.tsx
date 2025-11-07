
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { ChevronDown, Copy, Eye, EyeOff, Wallet, Plus } from "lucide-react";

interface PrepaidCompletionScreenProps {
  onComplete: () => void;
}

export const PrepaidCompletionScreen = ({ onComplete }: PrepaidCompletionScreenProps) => {
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [showCVV, setShowCVV] = useState(false);

  const cardNumber = "5312 3456 7890 1234";
  const cvv = "123";
  const expiry = "12/26";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  const addToWallet = () => {
    // In a real implementation, this would trigger the wallet integration
    if (isIOS) {
      // Apple Wallet integration would go here
      alert("Adding to Apple Wallet...");
    } else if (isAndroid) {
      // Google Wallet integration would go here
      alert("Adding to Google Wallet...");
    } else {
      alert("Digital wallet not supported on this device");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-slate-100">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm">
        <h1 className="text-lg font-semibold text-slate-800">MY PAYMENT VAULT</h1>
        <div className="w-6 h-6 rounded-full bg-slate-200"></div>
      </div>

      <div className="px-4 py-6">
        {/* Prepaid Card */}
        <div className="relative mb-6 max-w-md mx-auto">
          <div className="bg-gradient-to-r from-red-500 to-slate-800 rounded-2xl p-6 text-white shadow-lg aspect-[16/10]">
            {/* Card Brand */}
            <div className="flex items-center justify-between mb-8">
              <div className="bg-red-600 p-2 rounded">
                <div className="w-8 h-6 bg-red-700 rounded-sm"></div>
              </div>
              <div className="text-2xl font-bold text-slate-300">Reliant</div>
            </div>
            
            {/* Chip */}
            <div className="w-12 h-8 bg-gradient-to-br from-slate-300 to-slate-400 rounded mb-4 relative">
              <div className="absolute inset-1 bg-gradient-to-br from-slate-200 to-slate-300 rounded"></div>
              <div className="absolute inset-2 grid grid-cols-3 gap-0.5">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-slate-400 rounded-sm"></div>
                ))}
              </div>
            </div>

            {/* Card Number */}
            <div className="text-2xl font-mono mb-4 tracking-wider">
              {showCardNumber ? cardNumber : "5312 •••• •••• 1234"}
            </div>

            {/* Card Details */}
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs text-slate-300 mb-1">PREPAID</div>
                <div className="text-sm font-semibold">CARDHOLDER</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-mono">{expiry}</div>
              </div>
              <div className="flex space-x-1">
                <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                <div className="w-6 h-6 bg-yellow-400 rounded-full opacity-80"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Balance */}
        <div className="bg-slate-800 rounded-xl p-4 mb-4 text-white">
          <div className="text-sm text-slate-300 mb-1">Available Balance</div>
          <div className="text-3xl font-bold">$100.00</div>
        </div>

        {/* Card Details Drawer */}
        <Drawer>
          <DrawerTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-between p-4 h-auto border-slate-200 bg-white hover:bg-slate-50"
            >
              <span className="font-medium text-slate-700">Card Details</span>
              <ChevronDown className="w-5 h-5 text-slate-500" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="bg-white">
            <DrawerHeader>
              <DrawerTitle className="text-center text-slate-800">Card Information</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-8 space-y-4">
              {/* Card Number */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <div className="text-sm text-slate-600 mb-1">Card Number</div>
                  <div className="font-mono text-lg">
                    {showCardNumber ? cardNumber : "5312 •••• •••• 1234"}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCardNumber(!showCardNumber)}
                  >
                    {showCardNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(cardNumber)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Expiry Date */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <div className="text-sm text-slate-600 mb-1">Expiry Date</div>
                  <div className="font-mono text-lg">{expiry}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(expiry)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              {/* CVV */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <div className="text-sm text-slate-600 mb-1">CVV</div>
                  <div className="font-mono text-lg">
                    {showCVV ? cvv : "•••"}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCVV(!showCVV)}
                  >
                    {showCVV ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(cvv)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Card Status */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-800 font-medium mb-1">Card Status</div>
                <div className="text-green-700">Active • Ready for immediate use</div>
              </div>

              {/* Add to Wallet */}
              <Button 
                onClick={addToWallet}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white h-12 rounded-lg"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <Wallet className="w-4 h-4" />
                  <span>
                    {isIOS ? "Add to Apple Wallet" : isAndroid ? "Add to Google Wallet" : "Add to Wallet"}
                  </span>
                </div>
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};
