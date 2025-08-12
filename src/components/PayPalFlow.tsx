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
  const [connectedEmail, setConnectedEmail] = useState<string | null>(null);
  const [stage, setStage] = useState<"intro" | "email">("intro");
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    // Move to the mocked OAuth email confirmation step
    setStage("email");
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setError("Please enter a valid PayPal email.");
      return;
    }
    setError(null);
    setConnectedEmail(value);
    setOpen(false);
    setStage("intro");
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
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setStage("intro"); }}>
            <DialogTrigger asChild>
              <Button className="w-full">Log in with PayPal</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log in with PayPal</DialogTitle>
                <DialogDescription>This is a demo embed to collect your PayPal account.</DialogDescription>
              </DialogHeader>

              {stage === "intro" && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-200 p-6 text-center">
                    <p className="text-lg font-medium text-slate-800 mb-2">Choose how you get paid</p>
                    <p className="text-slate-600 mb-4">We'll transfer money to your PayPal account.</p>
                    <Button className="w-full" onClick={handleStart}>Get Started</Button>
                    <p className="mt-3 text-xs text-slate-500">Powered by PayPal</p>
                  </div>
                </div>
              )}

              {stage === "email" && (
                <form onSubmit={handleConnect} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="paypalEmail">PayPal email</Label>
                    <Input
                      id="paypalEmail"
                      type="email"
                      inputMode="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {error && <p className="text-sm text-red-600">{error}</p>}
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full">Continue</Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
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
