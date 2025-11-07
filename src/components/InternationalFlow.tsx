import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, CheckCircle2 } from "lucide-react";

interface InternationalFlowProps {
  onComplete: () => void;
}

interface BankDetails {
  accountHolderName: string;
  bankName: string;
  country: string;
  iban?: string;
  swift?: string;
  accountNumber?: string;
  routingNumber?: string;
  sortCode?: string;
  bsb?: string;
  transitNumber?: string;
  institutionNumber?: string;
}

type Stage = "country-selection" | "details-entry" | "confirmation" | "speed-bump";

const COUNTRIES = [
  { code: "AT", name: "Austria", format: "IBAN", region: "Europe" },
  { code: "BE", name: "Belgium", format: "IBAN", region: "Europe" },
  { code: "FR", name: "France", format: "IBAN", region: "Europe" },
  { code: "DE", name: "Germany", format: "IBAN", region: "Europe" },
  { code: "IT", name: "Italy", format: "IBAN", region: "Europe" },
  { code: "NL", name: "Netherlands", format: "IBAN", region: "Europe" },
  { code: "ES", name: "Spain", format: "IBAN", region: "Europe" },
  { code: "GB", name: "United Kingdom", format: "UK", region: "Europe" },
  { code: "US", name: "United States", format: "ACH", region: "Americas" },
  { code: "CA", name: "Canada", format: "EFT", region: "Americas" },
  { code: "AU", name: "Australia", format: "BSB", region: "Oceania" },
  { code: "JP", name: "Japan", format: "SWIFT", region: "Asia" },
  { code: "SG", name: "Singapore", format: "SWIFT", region: "Asia" },
  { code: "OTHER", name: "Other Country", format: "SWIFT", region: "Other" },
];

export const InternationalFlow = ({ onComplete }: InternationalFlowProps) => {
  const [stage, setStage] = useState<Stage>("country-selection");
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountHolderName: "",
    bankName: "",
    country: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedCountry = COUNTRIES.find((c) => c.code === bankDetails.country);

  const validateIBAN = (iban: string): boolean => {
    // Basic IBAN validation - starts with 2 letter country code followed by digits
    const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/;
    return ibanRegex.test(iban.replace(/\s/g, ""));
  };

  const validateDetails = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!bankDetails.accountHolderName.trim()) {
      newErrors.accountHolderName = "Account holder name is required";
    }
    if (!bankDetails.bankName.trim()) {
      newErrors.bankName = "Bank name is required";
    }

    if (selectedCountry?.format === "IBAN") {
      if (!bankDetails.iban) {
        newErrors.iban = "IBAN is required";
      } else if (!validateIBAN(bankDetails.iban)) {
        newErrors.iban = "Invalid IBAN format";
      }
    } else if (selectedCountry?.format === "ACH") {
      if (!bankDetails.routingNumber || bankDetails.routingNumber.length !== 9) {
        newErrors.routingNumber = "Valid 9-digit routing number required";
      }
      if (!bankDetails.accountNumber) {
        newErrors.accountNumber = "Account number is required";
      }
    } else if (selectedCountry?.format === "UK") {
      if (!bankDetails.sortCode || bankDetails.sortCode.replace(/-/g, "").length !== 6) {
        newErrors.sortCode = "Valid 6-digit sort code required";
      }
      if (!bankDetails.accountNumber) {
        newErrors.accountNumber = "Account number is required";
      }
    } else if (selectedCountry?.format === "EFT") {
      if (!bankDetails.transitNumber || bankDetails.transitNumber.length !== 5) {
        newErrors.transitNumber = "Valid 5-digit transit number required";
      }
      if (!bankDetails.institutionNumber || bankDetails.institutionNumber.length !== 3) {
        newErrors.institutionNumber = "Valid 3-digit institution number required";
      }
      if (!bankDetails.accountNumber) {
        newErrors.accountNumber = "Account number is required";
      }
    } else if (selectedCountry?.format === "BSB") {
      if (!bankDetails.bsb || bankDetails.bsb.replace(/-/g, "").length !== 6) {
        newErrors.bsb = "Valid 6-digit BSB required";
      }
      if (!bankDetails.accountNumber) {
        newErrors.accountNumber = "Account number is required";
      }
    } else {
      if (!bankDetails.swift) {
        newErrors.swift = "SWIFT/BIC code is required";
      }
      if (!bankDetails.accountNumber) {
        newErrors.accountNumber = "Account number is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCountrySelect = (countryCode: string) => {
    setBankDetails({ ...bankDetails, country: countryCode });
    setStage("details-entry");
  };

  const handleDetailsSubmit = () => {
    if (validateDetails()) {
      setStage("confirmation");
    }
  };

  const handleConfirm = () => {
    setStage("speed-bump");
  };

  const handleSpeedBumpContinue = () => {
    onComplete();
  };

  const maskAccountNumber = (num: string | undefined): string => {
    if (!num) return "";
    if (num.length <= 4) return num;
    return "•••• " + num.slice(-4);
  };

  if (stage === "speed-bump") {
    return (
      <Card className="border-slate-200">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="flex items-center justify-center space-x-2 text-4xl">
              <Globe className="w-12 h-12 text-blue-600" />
              <span className="text-blue-600">→</span>
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <p className="text-base font-medium text-gray-900">International bank account connected successfully</p>
            <p className="text-sm text-gray-600">Click continue to send funds to your international bank account.</p>
            <Button onClick={handleSpeedBumpContinue} className="w-full bg-blue-600 hover:bg-blue-700">
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (stage === "country-selection") {
    return (
      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-slate-900">International Bank Transfer</CardTitle>
              <CardDescription>Select your country to continue</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select onValueChange={handleCountrySelect}>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {["Europe", "Americas", "Asia", "Oceania", "Other"].map((region) => {
                  const regionCountries = COUNTRIES.filter((c) => c.region === region);
                  if (regionCountries.length === 0) return null;
                  return (
                    <div key={region}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">{region}</div>
                      {regionCountries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </div>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (stage === "confirmation") {
    return (
      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-slate-900">Confirm Your Details</CardTitle>
              <CardDescription>Please verify your bank account information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border border-slate-200 p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Country:</span>
              <span className="font-medium text-gray-900">{selectedCountry?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Account Holder:</span>
              <span className="font-medium text-gray-900">{bankDetails.accountHolderName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Bank Name:</span>
              <span className="font-medium text-gray-900">{bankDetails.bankName}</span>
            </div>
            {selectedCountry?.format === "IBAN" && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">IBAN:</span>
                <span className="font-medium text-gray-900 font-mono">{bankDetails.iban}</span>
              </div>
            )}
            {selectedCountry?.format === "ACH" && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Routing Number:</span>
                  <span className="font-medium text-gray-900 font-mono">{bankDetails.routingNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Account Number:</span>
                  <span className="font-medium text-gray-900 font-mono">{maskAccountNumber(bankDetails.accountNumber)}</span>
                </div>
              </>
            )}
            {selectedCountry?.format === "UK" && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sort Code:</span>
                  <span className="font-medium text-gray-900 font-mono">{bankDetails.sortCode}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Account Number:</span>
                  <span className="font-medium text-gray-900 font-mono">{maskAccountNumber(bankDetails.accountNumber)}</span>
                </div>
              </>
            )}
            {selectedCountry?.format === "EFT" && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Transit Number:</span>
                  <span className="font-medium text-gray-900 font-mono">{bankDetails.transitNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Institution Number:</span>
                  <span className="font-medium text-gray-900 font-mono">{bankDetails.institutionNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Account Number:</span>
                  <span className="font-medium text-gray-900 font-mono">{maskAccountNumber(bankDetails.accountNumber)}</span>
                </div>
              </>
            )}
            {selectedCountry?.format === "BSB" && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">BSB:</span>
                  <span className="font-medium text-gray-900 font-mono">{bankDetails.bsb}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Account Number:</span>
                  <span className="font-medium text-gray-900 font-mono">{maskAccountNumber(bankDetails.accountNumber)}</span>
                </div>
              </>
            )}
            {selectedCountry?.format === "SWIFT" && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">SWIFT/BIC:</span>
                  <span className="font-medium text-gray-900 font-mono">{bankDetails.swift}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Account Number:</span>
                  <span className="font-medium text-gray-900 font-mono">{maskAccountNumber(bankDetails.accountNumber)}</span>
                </div>
              </>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
            <p className="font-medium mb-1">Secure Transfer</p>
            <p className="text-blue-800">Your bank details are encrypted and securely transmitted.</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStage("details-entry")} className="w-full">
              Edit Details
            </Button>
            <Button onClick={handleConfirm} className="w-full bg-blue-600 hover:bg-blue-700">
              Confirm & Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Globe className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-slate-900">Enter Bank Details</CardTitle>
            <CardDescription>{selectedCountry?.name}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="accountHolderName">Account Holder Name</Label>
          <Input
            id="accountHolderName"
            value={bankDetails.accountHolderName}
            onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
            placeholder="John Doe"
          />
          {errors.accountHolderName && <p className="text-sm text-red-600">{errors.accountHolderName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bankName">Bank Name</Label>
          <Input
            id="bankName"
            value={bankDetails.bankName}
            onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
            placeholder="Bank of America"
          />
          {errors.bankName && <p className="text-sm text-red-600">{errors.bankName}</p>}
        </div>

        {selectedCountry?.format === "IBAN" && (
          <div className="space-y-2">
            <Label htmlFor="iban">IBAN</Label>
            <Input
              id="iban"
              value={bankDetails.iban}
              onChange={(e) => setBankDetails({ ...bankDetails, iban: e.target.value.toUpperCase() })}
              placeholder="DE89370400440532013000"
              className="font-mono"
            />
            {errors.iban && <p className="text-sm text-red-600">{errors.iban}</p>}
            <p className="text-xs text-gray-500">Example: DE89370400440532013000</p>
          </div>
        )}

        {selectedCountry?.format === "ACH" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="routingNumber">Routing Number (ABA)</Label>
              <Input
                id="routingNumber"
                value={bankDetails.routingNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, routingNumber: e.target.value.replace(/\D/g, "") })}
                placeholder="123456789"
                maxLength={9}
                className="font-mono"
              />
              {errors.routingNumber && <p className="text-sm text-red-600">{errors.routingNumber}</p>}
              <p className="text-xs text-gray-500">9-digit number found on your check</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                placeholder="000123456789"
                className="font-mono"
              />
              {errors.accountNumber && <p className="text-sm text-red-600">{errors.accountNumber}</p>}
            </div>
          </>
        )}

        {selectedCountry?.format === "UK" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="sortCode">Sort Code</Label>
              <Input
                id="sortCode"
                value={bankDetails.sortCode}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length > 2) value = value.slice(0, 2) + "-" + value.slice(2);
                  if (value.length > 5) value = value.slice(0, 5) + "-" + value.slice(5);
                  setBankDetails({ ...bankDetails, sortCode: value.slice(0, 8) });
                }}
                placeholder="12-34-56"
                className="font-mono"
              />
              {errors.sortCode && <p className="text-sm text-red-600">{errors.sortCode}</p>}
              <p className="text-xs text-gray-500">Format: 12-34-56</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                placeholder="12345678"
                className="font-mono"
              />
              {errors.accountNumber && <p className="text-sm text-red-600">{errors.accountNumber}</p>}
            </div>
          </>
        )}

        {selectedCountry?.format === "EFT" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="transitNumber">Transit Number</Label>
              <Input
                id="transitNumber"
                value={bankDetails.transitNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, transitNumber: e.target.value.replace(/\D/g, "").slice(0, 5) })}
                placeholder="12345"
                maxLength={5}
                className="font-mono"
              />
              {errors.transitNumber && <p className="text-sm text-red-600">{errors.transitNumber}</p>}
              <p className="text-xs text-gray-500">5-digit branch number</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="institutionNumber">Institution Number</Label>
              <Input
                id="institutionNumber"
                value={bankDetails.institutionNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, institutionNumber: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                placeholder="001"
                maxLength={3}
                className="font-mono"
              />
              {errors.institutionNumber && <p className="text-sm text-red-600">{errors.institutionNumber}</p>}
              <p className="text-xs text-gray-500">3-digit bank number</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                placeholder="1234567"
                className="font-mono"
              />
              {errors.accountNumber && <p className="text-sm text-red-600">{errors.accountNumber}</p>}
            </div>
          </>
        )}

        {selectedCountry?.format === "BSB" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="bsb">BSB Number</Label>
              <Input
                id="bsb"
                value={bankDetails.bsb}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length > 3) value = value.slice(0, 3) + "-" + value.slice(3);
                  setBankDetails({ ...bankDetails, bsb: value.slice(0, 7) });
                }}
                placeholder="123-456"
                className="font-mono"
              />
              {errors.bsb && <p className="text-sm text-red-600">{errors.bsb}</p>}
              <p className="text-xs text-gray-500">Format: 123-456</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                placeholder="12345678"
                className="font-mono"
              />
              {errors.accountNumber && <p className="text-sm text-red-600">{errors.accountNumber}</p>}
            </div>
          </>
        )}

        {selectedCountry?.format === "SWIFT" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="swift">SWIFT/BIC Code</Label>
              <Input
                id="swift"
                value={bankDetails.swift}
                onChange={(e) => setBankDetails({ ...bankDetails, swift: e.target.value.toUpperCase() })}
                placeholder="ABCDUS33XXX"
                className="font-mono"
              />
              {errors.swift && <p className="text-sm text-red-600">{errors.swift}</p>}
              <p className="text-xs text-gray-500">8 or 11 character code</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                placeholder="1234567890"
                className="font-mono"
              />
              {errors.accountNumber && <p className="text-sm text-red-600">{errors.accountNumber}</p>}
            </div>
          </>
        )}

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={() => setStage("country-selection")} className="w-full">
            Back
          </Button>
          <Button onClick={handleDetailsSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
