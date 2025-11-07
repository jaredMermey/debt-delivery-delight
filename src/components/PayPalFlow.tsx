import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Banknote } from "lucide-react";

export const PayPalFlow = ({ onComplete }: { onComplete?: () => void }) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [connectedEmail, setConnectedEmail] = useState<string | null>(null);
  const [stage, setStage] = useState<"intro" | "login" | "consent">("intro");
  const [error, setError] = useState<string | null>(null);
  const [showSpeedBump, setShowSpeedBump] = useState(false);

  const handleStart = () => {
    setStage("login");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email or phone number.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    setError(null);
    setStage("consent");
  };

  const handleConsent = () => {
    setConnectedEmail(email);
    setShowSpeedBump(true);
    setOpen(false);
    setStage("intro");
  };

  const handleSpeedBumpContinue = () => {
    setShowSpeedBump(false);
    setEmail("");
    setPassword("");
    onComplete?.();
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Banknote className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-slate-800">Connect PayPal</CardTitle>
            <CardDescription className="text-slate-600">Log in with PayPal to receive your funds.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!connectedEmail ? (
          <Dialog open={open} onOpenChange={(o) => { 
            setOpen(o); 
            if (!o) {
              setStage("intro");
              setEmail("");
              setPassword("");
              setError(null);
            }
          }}>
            <DialogTrigger asChild>
              <Button className="w-full bg-[#0070ba] hover:bg-[#005ea6]">Log in with PayPal</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <div className="flex items-center justify-center py-4">
                <svg className="w-24 h-8" viewBox="0 0 100 32" fill="none">
                  <path d="M12 8.5h8.5c3.5 0 6 2.5 6 6s-2.5 6-6 6H17l-1.5 7h-4L12 8.5z" fill="#003087"/>
                  <path d="M19 11h8.5c3.5 0 6 2.5 6 6s-2.5 6-6 6H24l-1.5 7h-4L19 11z" fill="#009cde"/>
                  <text x="40" y="22" fill="#003087" fontSize="14" fontWeight="bold">PayPal</text>
                </svg>
              </div>

              {stage === "intro" && (
                <div className="space-y-4 py-4">
                  <div className="text-center space-y-2">
                    <p className="text-base text-gray-700">Connect your PayPal account to speed up the process</p>
                  </div>
                  <Button className="w-full bg-[#0070ba] hover:bg-[#005ea6]" onClick={handleStart}>
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 8h10c2.8 0 5 2.2 5 5s-2.2 5-5 5h-3l-1 5H9l1-5H7l-1 5H2L7 8z"/>
                    </svg>
                    Log in with PayPal
                  </Button>
                </div>
              )}

              {stage === "login" && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        type="text"
                        placeholder="Email or phone number"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                  </div>
                  <Button type="submit" className="w-full bg-[#0070ba] hover:bg-[#005ea6]">
                    Log In
                  </Button>
                  <div className="text-center space-y-3">
                    <button type="button" className="text-sm text-[#0070ba] hover:underline">
                      Having trouble logging in?
                    </button>
                    <div className="text-sm text-gray-500">or</div>
                    <Button type="button" variant="outline" className="w-full">
                      Sign Up
                    </Button>
                  </div>
                </form>
              )}

              {stage === "consent" && (
                <div className="space-y-4">
                  <button
                    onClick={() => setStage("login")}
                    className="text-[#0070ba] hover:underline flex items-center"
                  >
                    ← Back
                  </button>
                  <div className="space-y-4">
                    <div className="text-center space-y-2">
                      <p className="text-base font-medium">Connect your PayPal account to [Partner]</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <p className="text-sm font-medium">This lets [Partner]:</p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-gray-300 flex-shrink-0 mt-0.5"></div>
                          <div>
                            <p className="text-sm font-medium">Receive personal info</p>
                            <p className="text-xs text-gray-600">Full name, email address, shipping address</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-gray-300 flex-shrink-0 mt-0.5"></div>
                          <div>
                            <p className="text-sm font-medium">Access payment methods</p>
                            <p className="text-xs text-gray-600">Access last 4 digits of your available payment methods</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>This website or app is responsible for the use of your info in accordance with its <span className="text-[#0070ba]">Privacy Statement</span> and <span className="text-[#0070ba]">Terms and Conditions</span>. You can stop future sharing of your info at any time in your <span className="text-[#0070ba]">PayPal Profile</span>.</p>
                    </div>
                    <Button onClick={handleConsent} className="w-full bg-[#0070ba] hover:bg-[#005ea6]">
                      Log in
                    </Button>
                    <Button variant="link" className="w-full text-[#0070ba]">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

            </DialogContent>
          </Dialog>
        ) : showSpeedBump ? (
          <div className="bg-blue-50 p-6 rounded-lg text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#0070ba">
                <path d="M7 8h10c2.8 0 5 2.2 5 5s-2.2 5-5 5h-3l-1 5H9l1-5H7l-1 5H2L7 8z"/>
              </svg>
              <div className="flex gap-1">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-[#0070ba]"></div>
                ))}
              </div>
              <span className="text-[#0070ba]">→</span>
            </div>
            <p className="text-base font-medium text-gray-900">PayPal account connected successfully</p>
            <p className="text-sm text-gray-600">Click continue to send funds to connected PayPal account.</p>
            <Button onClick={handleSpeedBumpContinue} className="w-full bg-[#0070ba] hover:bg-[#005ea6]">
              Continue
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Connected</AlertTitle>
              <AlertDescription className="text-green-700">
                Funds will be sent to your PayPal account {connectedEmail}.
              </AlertDescription>
            </Alert>
            <Button type="button" className="w-full" onClick={() => onComplete?.()}>
              Continue
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
