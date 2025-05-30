
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { MockPlaidLink } from "./MockPlaidLink";

interface RealTimeFlowProps {
  onComplete: () => void;
}

interface BankAccount {
  id: string;
  name: string;
  type: string;
  mask: string;
}

interface ConnectedBankInfo {
  bankName: string;
  account: BankAccount;
}

export const RealTimeFlow = ({ onComplete }: RealTimeFlowProps) => {
  const [isPlaidOpen, setIsPlaidOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [bankInfo, setBankInfo] = useState<ConnectedBankInfo | null>(null);

  const handlePlaidSuccess = (data: { institution: string; accounts: any[] }) => {
    // Use the first selected account
    const primaryAccount = data.accounts[0];
    setBankInfo({
      bankName: data.institution,
      account: primaryAccount
    });
    setIsConnected(true);
  };

  const handleConfirm = () => {
    onComplete();
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Real Time Payment Setup</CardTitle>
              <p className="text-gray-600">Connect your bank account for instant transfer</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isConnected ? (
            <>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold text-orange-900">1% Fee Notice</span>
                </div>
                <p className="text-sm text-orange-800">
                  Real-time payments include a 1% processing fee for instant availability. 
                  Your funds will be available in your account within minutes.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Bank-Level Security</span>
                </div>
                <p className="text-sm text-blue-800">
                  We use industry-standard encryption to protect your banking information. 
                  Your credentials are never stored on our servers.
                </p>
              </div>

              <div className="text-center py-8">
                <Button 
                  onClick={() => setIsPlaidOpen(true)}
                  className="w-full max-w-sm bg-orange-600 hover:bg-orange-700 h-12 text-lg"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Connect Bank Account
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Powered by Plaid - Trusted by millions of users
              </div>
            </>
          ) : (
            <>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-900">Bank Account Connected</span>
                </div>
              </div>

              {bankInfo && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Bank Name</Label>
                      <Input value={bankInfo.bankName} readOnly className="bg-gray-50" />
                    </div>
                    <div>
                      <Label>Account Type</Label>
                      <Input value={bankInfo.account.type} readOnly className="bg-gray-50" />
                    </div>
                  </div>
                  <div>
                    <Label>Account Number (Last 4 digits)</Label>
                    <Input value={`****${bankInfo.account.mask}`} readOnly className="bg-gray-50" />
                  </div>
                </div>
              )}

              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Real-time payment will be processed instantly with a 1% fee.</strong>
                  <br />
                  Expected delivery: Within minutes after settlement approval.
                </p>
              </div>

              <Button 
                onClick={handleConfirm}
                className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-lg"
              >
                Confirm Real Time Payment
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <MockPlaidLink
        isOpen={isPlaidOpen}
        onClose={() => setIsPlaidOpen(false)}
        onSuccess={handlePlaidSuccess}
      />
    </>
  );
};
