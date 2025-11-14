import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bitcoin, Loader2, Shield, CheckCircle, Upload, Wallet, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface CryptoFlowProps {
  onComplete: () => void;
  settlementAmount?: number;
}

interface CryptoOption {
  id: string;
  name: string;
  symbol: string;
  rate: number;
  icon: string;
}

const CRYPTO_OPTIONS: CryptoOption[] = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', rate: 94984.26, icon: '₿' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', rate: 3163.48, icon: 'Ξ' },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', rate: 0.9997, icon: '₮' },
  { id: 'xrp', name: 'XRP', symbol: 'XRP', rate: 2.29, icon: 'X' },
  { id: 'bnb', name: 'BNB', symbol: 'BNB', rate: 919.94, icon: 'B' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', rate: 141.07, icon: '◎' },
  { id: 'usdc', name: 'USD Coin', symbol: 'USDC', rate: 0.9998, icon: '$' },
  { id: 'trx', name: 'TRON', symbol: 'TRX', rate: 0.2950, icon: 'T' },
  { id: 'steth', name: 'Lido Staked Ether', symbol: 'stETH', rate: 3162.28, icon: 'Ξ' },
  { id: 'doge', name: 'Dogecoin', symbol: 'DOGE', rate: 0.1614, icon: 'Ð' },
  { id: 'ada', name: 'Cardano', symbol: 'ADA', rate: 0.5085, icon: '₳' },
  { id: 'wbtc', name: 'Wrapped Bitcoin', symbol: 'WBTC', rate: 95316.03, icon: '₿' },
  { id: 'wsteth', name: 'Wrapped stETH', symbol: 'wstETH', rate: 3852.62, icon: 'Ξ' },
  { id: 'link', name: 'Chainlink', symbol: 'LINK', rate: 14.15, icon: '⬡' },
  { id: 'bch', name: 'Bitcoin Cash', symbol: 'BCH', rate: 490.97, icon: '₿' },
  { id: 'zec', name: 'Zcash', symbol: 'ZEC', rate: 592.74, icon: 'Z' },
  { id: 'xlm', name: 'Stellar', symbol: 'XLM', rate: 0.2647, icon: '*' },
  { id: 'xmr', name: 'Monero', symbol: 'XMR', rate: 398.35, icon: 'ɱ' },
  { id: 'ltc', name: 'Litecoin', symbol: 'LTC', rate: 97.19, icon: 'Ł' },
  { id: 'hbar', name: 'Hedera', symbol: 'HBAR', rate: 0.16, icon: 'H' },
  { id: 'leo', name: 'LEO Token', symbol: 'LEO', rate: 9.19, icon: 'L' },
  { id: 'usds', name: 'USDS', symbol: 'USDS', rate: 1.00, icon: '$' },
  { id: 'usde', name: 'Ethena', symbol: 'USDE', rate: 0.9991, icon: '$' },
  { id: 'hype', name: 'Hyperliquid', symbol: 'HYPE', rate: 37.23, icon: 'H' },
];

const POPULAR_CRYPTO_IDS = ['btc', 'eth', 'usdt', 'xrp', 'bnb', 'sol'];

export const CryptoFlow = ({ onComplete, settlementAmount = 2500 }: CryptoFlowProps) => {
  const [stage, setStage] = useState<'select' | 'kyc' | 'pending' | 'approved'>('select');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // KYC Form State
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    ssn: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentPreview, setDocumentPreview] = useState<string>('');

  const handleCryptoSelect = (crypto: CryptoOption) => {
    setSelectedCrypto(crypto);
  };

  const handleContinueToKYC = () => {
    if (!selectedCrypto) {
      toast.error("Please select a cryptocurrency");
      return;
    }
    setStage('kyc');
  };

  const formatSSN = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 9)}`;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'ssn') {
      value = formatSSN(value);
    } else if (field === 'phone') {
      value = formatPhone(value);
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
        toast.error("Only JPG, PNG, or PDF files are accepted");
        return;
      }
      setDocumentFile(file);
      
      if (file.type !== 'application/pdf') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setDocumentPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setDocumentPreview('');
      }
    }
  };

  const isFormValid = () => {
    return (
      formData.firstName && formData.lastName && formData.dateOfBirth &&
      formData.ssn.length === 11 && formData.phone.length === 14 &&
      formData.street && formData.city && formData.state &&
      formData.postalCode && documentFile
    );
  };

  const handleSubmitKYC = () => {
    if (!isFormValid()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsProcessing(true);
    setStage('pending');
    
    // Simulate verification process
    setTimeout(() => {
      // Generate mock wallet address
      const mockAddress = selectedCrypto?.symbol === 'BTC' 
        ? '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
        : selectedCrypto?.symbol === 'ETH'
        ? '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
        : `${selectedCrypto?.symbol}1234567890abcdef`;
      
      setWalletAddress(mockAddress);
      setStage('approved');
      setIsProcessing(false);
    }, 3000);
  };

  const handleViewWallet = () => {
    onComplete();
  };

  const cryptoAmount = selectedCrypto ? (settlementAmount / selectedCrypto.rate).toFixed(8) : '0';

  // Filter crypto options based on search query
  const filteredCryptos = searchQuery 
    ? CRYPTO_OPTIONS.filter(crypto => 
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : CRYPTO_OPTIONS.filter(crypto => POPULAR_CRYPTO_IDS.includes(crypto.id));

  // Stage 1: Crypto Selection
  if (stage === 'select') {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Bitcoin className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Choose Your Cryptocurrency</CardTitle>
              <p className="text-gray-600">Select how you'd like to receive your funds</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-orange-900">Settlement Amount</span>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-900">${settlementAmount.toLocaleString()}</div>
                <div className="text-sm text-orange-700">USD</div>
              </div>
            </div>
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="crypto-search">Search Cryptocurrency</Label>
            <Input
              id="crypto-search"
              type="text"
              placeholder="Search by name or symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            {!searchQuery && (
              <p className="text-sm text-gray-500">Popular choices shown below</p>
            )}
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredCryptos.map((crypto) => {
              const amount = (settlementAmount / crypto.rate).toFixed(8);
              const isSelected = selectedCrypto?.id === crypto.id;
              
              return (
                <button
                  key={crypto.id}
                  onClick={() => handleCryptoSelect(crypto)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl">
                        {crypto.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{crypto.name}</div>
                        <div className="text-sm text-gray-600">{crypto.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{amount} {crypto.symbol}</div>
                      <div className="text-sm text-gray-600">${crypto.rate.toLocaleString()} / {crypto.symbol}</div>
                    </div>
                  </div>
                </button>
              );
            })}
            {filteredCryptos.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No cryptocurrencies found matching "{searchQuery}"</p>
                <p className="text-sm mt-2">Try a different search term</p>
              </div>
            )}
          </div>

          <Button
            onClick={handleContinueToKYC}
            disabled={!selectedCrypto}
            className="w-full h-12 text-lg bg-orange-600 hover:bg-orange-700"
          >
            Continue to Verification
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Stage 2: KYC Form
  if (stage === 'kyc') {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Identity Verification</CardTitle>
              <p className="text-gray-600">Complete KYC to open your crypto wallet</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Secure & Confidential</span>
            </div>
            <p className="text-sm text-blue-800">
              Your information is encrypted and used solely for regulatory compliance.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>First Name *</Label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="John"
                />
              </div>
              <div>
                <Label>Middle Name</Label>
                <Input
                  value={formData.middleName}
                  onChange={(e) => handleInputChange('middleName', e.target.value)}
                  placeholder="M."
                />
              </div>
              <div>
                <Label>Last Name *</Label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Date of Birth *</Label>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>
              <div>
                <Label>Social Security Number *</Label>
                <Input
                  value={formData.ssn}
                  onChange={(e) => handleInputChange('ssn', e.target.value)}
                  placeholder="XXX-XX-XXXX"
                  maxLength={11}
                />
              </div>
              <div>
                <Label>Phone Number *</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(XXX) XXX-XXXX"
                  maxLength={14}
                />
              </div>
            </div>

            <div>
              <Label>Street Address *</Label>
              <Input
                value={formData.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Label>City *</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="New York"
                />
              </div>
              <div>
                <Label>State *</Label>
                <Input
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="NY"
                />
              </div>
              <div>
                <Label>Postal Code *</Label>
                <Input
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  placeholder="10001"
                />
              </div>
            </div>

            <div>
              <Label>Identity Document (Passport or Driver's License) *</Label>
              <div className="mt-2">
                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 transition-colors">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={handleFileChange}
                  />
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {documentFile ? documentFile.name : 'Click to upload (JPG, PNG, or PDF)'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Maximum size: 10MB</p>
                  </div>
                </label>
              </div>
              {documentPreview && (
                <div className="mt-4">
                  <img src={documentPreview} alt="Document preview" className="max-h-48 rounded-lg mx-auto" />
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => setStage('select')}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmitKYC}
              disabled={!isFormValid()}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              Submit for Verification
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Stage 3: Verification Pending
  if (stage === 'pending') {
    return (
      <Card className="w-full">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Verifying Your Identity</h2>
          <p className="text-gray-600 mb-6">
            Please wait while we review your information and documents. This typically takes just a few moments.
          </p>
          
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Stage 4: Approved
  if (stage === 'approved') {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Approved!</h2>
          <p className="text-gray-600 mb-6">
            Your crypto wallet has been successfully created and verified.
          </p>

          <div className="bg-orange-50 p-6 rounded-lg mb-6">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Wallet className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-900">Your New Wallet</span>
            </div>
            <div className="text-3xl font-bold text-orange-900 mb-2">
              {cryptoAmount} {selectedCrypto?.symbol}
            </div>
            <div className="text-sm text-orange-700 mb-4">
              ≈ ${settlementAmount.toLocaleString()} USD
            </div>
            <div className="bg-white p-3 rounded border border-orange-200">
              <p className="text-xs text-gray-600 mb-1">Wallet Address</p>
              <p className="text-sm font-mono text-gray-900 break-all">{walletAddress}</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3 justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Identity verified</span>
            </div>
            <div className="flex items-center space-x-3 justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Wallet created on {selectedCrypto?.name} network</span>
            </div>
            <div className="flex items-center space-x-3 justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Funds will be transferred upon settlement</span>
            </div>
          </div>

          <Button
            onClick={handleViewWallet}
            className="w-full max-w-sm bg-orange-600 hover:bg-orange-700 h-12 text-lg"
          >
            <Wallet className="w-5 h-5 mr-2" />
            View My Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
};
