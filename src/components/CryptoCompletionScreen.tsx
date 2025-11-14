import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bitcoin, Wallet, Copy, CheckCircle, ChevronDown, ChevronUp, Shield } from "lucide-react";
import { toast } from "sonner";

interface CryptoCompletionScreenProps {
  onComplete: () => void;
}

export const CryptoCompletionScreen = ({ onComplete }: CryptoCompletionScreenProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Mock data - would come from props or context in real implementation
  const cryptoData = {
    amount: 0.0526,
    symbol: 'BTC',
    usdValue: 2500.00,
    walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    network: 'Bitcoin Network (BTC)',
    createdDate: new Date().toLocaleDateString(),
    currentPrice: 47500.00,
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(cryptoData.walletAddress);
    toast.success("Wallet address copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardContent className="p-8">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bitcoin className="w-10 h-10 text-orange-600" />
          </div>
          
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Crypto Wallet Active!</h1>
            <p className="text-gray-600">
              Your cryptocurrency wallet is ready to receive funds.
            </p>
          </div>

          {/* Main Balance Display */}
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-6 rounded-xl mb-6 text-white text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Wallet className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">Total Balance</span>
            </div>
            <div className="text-4xl font-bold mb-2">
              {cryptoData.amount.toFixed(8)} {cryptoData.symbol}
            </div>
            <div className="text-lg opacity-90">
              ≈ ${cryptoData.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
            </div>
            <div className="text-xs opacity-75 mt-2">
              1 {cryptoData.symbol} = ${cryptoData.currentPrice.toLocaleString()}
            </div>
          </div>

          {/* Settlement Info */}
          <div className="bg-orange-50 p-4 rounded-lg mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-900">Settlement Status</span>
            </div>
            <p className="text-sm text-orange-800">
              Funds will be transferred to your wallet upon settlement approval. 
              You'll be notified once the transaction is complete.
            </p>
          </div>

          {/* Verification Badges */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Wallet verified and secured</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Identity verification complete</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Ready to receive {cryptoData.symbol}</span>
            </div>
          </div>

          {/* Collapsible Wallet Details */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="font-semibold text-gray-900">Wallet Details</span>
              {showDetails ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>
            
            {showDetails && (
              <div className="p-4 space-y-4 bg-white">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Wallet Address</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-mono text-gray-900 break-all flex-1">
                      {cryptoData.walletAddress}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyAddress}
                      className="shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Network</p>
                    <p className="text-sm font-medium text-gray-900">{cryptoData.network}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Created</p>
                    <p className="text-sm font-medium text-gray-900">{cryptoData.createdDate}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-600 mb-1">Cryptocurrency</p>
                  <p className="text-sm font-medium text-gray-900">{cryptoData.symbol} - Bitcoin</p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-900 font-medium mb-1">Security Note</p>
                  <p className="text-xs text-blue-800">
                    This wallet is secured with industry-standard encryption. Never share your private keys.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <Button
              onClick={handleCopyAddress}
              variant="outline"
              className="w-full"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Wallet Address
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
