
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Search, CheckCircle, Loader2, ArrowLeft } from "lucide-react";

interface MockAccount {
  id: string;
  name: string;
  type: string;
  mask: string;
  balance: string;
}

interface MockBank {
  id: string;
  name: string;
  logo: string;
  accounts: MockAccount[];
}

interface MockPlaidLinkProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: { institution: string; accounts: MockAccount[] }) => void;
}

const mockBanks: MockBank[] = [
  {
    id: "chase",
    name: "Chase",
    logo: "🏦",
    accounts: [
      { id: "1", name: "Chase Total Checking", type: "Checking", mask: "4829", balance: "$2,847.92" },
      { id: "2", name: "Chase Savings", type: "Savings", mask: "7331", balance: "$15,429.18" }
    ]
  },
  {
    id: "bofa",
    name: "Bank of America",
    logo: "🏛️",
    accounts: [
      { id: "3", name: "Advantage Plus Banking", type: "Checking", mask: "2156", balance: "$1,923.44" },
      { id: "4", name: "Rewards Savings", type: "Savings", mask: "8942", balance: "$8,765.33" }
    ]
  },
  {
    id: "wells",
    name: "Wells Fargo",
    logo: "🐎",
    accounts: [
      { id: "5", name: "Everyday Checking", type: "Checking", mask: "9873", balance: "$4,521.67" },
      { id: "6", name: "Way2Save Savings", type: "Savings", mask: "1047", balance: "$12,890.45" }
    ]
  },
  {
    id: "citi",
    name: "Citibank",
    logo: "🏢",
    accounts: [
      { id: "7", name: "Basic Banking", type: "Checking", mask: "5629", balance: "$3,147.89" }
    ]
  }
];

export const MockPlaidLink = ({ isOpen, onClose, onSuccess }: MockPlaidLinkProps) => {
  const [currentStep, setCurrentStep] = useState<"bank-selection" | "login" | "account-selection">("bank-selection");
  const [selectedBank, setSelectedBank] = useState<MockBank | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

  const filteredBanks = mockBanks.filter(bank =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBankSelect = (bank: MockBank) => {
    setSelectedBank(bank);
    setCurrentStep("login");
  };

  const handleLogin = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setCurrentStep("account-selection");
  };

  const handleAccountToggle = (accountId: string) => {
    setSelectedAccounts(prev =>
      prev.includes(accountId)
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleContinue = () => {
    if (selectedBank && selectedAccounts.length > 0) {
      const accounts = selectedBank.accounts.filter(acc => selectedAccounts.includes(acc.id));
      onSuccess({
        institution: selectedBank.name,
        accounts
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setCurrentStep("bank-selection");
    setSelectedBank(null);
    setSearchTerm("");
    setSelectedAccounts([]);
    onClose();
  };

  const handleBack = () => {
    if (currentStep === "login") {
      setCurrentStep("bank-selection");
      setSelectedBank(null);
    } else if (currentStep === "account-selection") {
      setCurrentStep("login");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4">
          <div className="flex items-center justify-between">
            {currentStep !== "bank-selection" && (
              <Button variant="ghost" size="sm" onClick={handleBack} className="text-white hover:bg-blue-700">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div className="text-lg font-semibold">Connect your bank</div>
            <div className="w-8" />
          </div>
          <div className="text-sm opacity-90 mt-1">
            Powered by Plaid
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Bank Selection */}
          {currentStep === "bank-selection" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="search">Search for your bank</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="e.g. Chase, Bank of America"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredBanks.map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => handleBankSelect(bank)}
                    className="w-full flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="text-2xl">{bank.logo}</span>
                    <span className="font-medium">{bank.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Login */}
          {currentStep === "login" && selectedBank && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl mb-2">{selectedBank.logo}</div>
                <div className="font-semibold text-lg">{selectedBank.name}</div>
                <div className="text-sm text-gray-600">Enter your online banking credentials</div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="Enter username" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter password" className="mt-1" />
                </div>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Your credentials are encrypted and secure. Plaid does not store your login information.
              </div>

              <Button onClick={handleLogin} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          )}

          {/* Account Selection */}
          {currentStep === "account-selection" && selectedBank && (
            <div className="space-y-4">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="font-semibold">Successfully connected!</div>
                <div className="text-sm text-gray-600">Select accounts to link</div>
              </div>

              <div className="space-y-2">
                {selectedBank.accounts.map((account) => (
                  <div
                    key={account.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      selectedAccounts.includes(account.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => handleAccountToggle(account.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{account.name}</div>
                        <div className="text-sm text-gray-600">
                          {account.type} •••• {account.mask}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{account.balance}</div>
                        {selectedAccounts.includes(account.id) && (
                          <CheckCircle className="w-4 h-4 text-blue-500 ml-auto mt-1" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleContinue}
                disabled={selectedAccounts.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Continue ({selectedAccounts.length} selected)
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
