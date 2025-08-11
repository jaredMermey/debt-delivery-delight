import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Wallet } from "lucide-react";

export const VenmoFlow = () => {
  const [open, setOpen] = useState(false);
  const [venmoHandle, setVenmoHandle] = useState("");
  const [connectedHandle, setConnectedHandle] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    const handle = venmoHandle.trim().replace(/^@?/, "@");
    if (!handle || handle === "@") {
      setError("Please enter your Venmo handle.");
      return;
    }
    setError(null);
    setConnectedHandle(handle);
    setOpen(false);
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-slate-800">Connect Venmo</CardTitle>
            <CardDescription className="text-slate-600">Log in with Venmo to receive your funds.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!connectedHandle ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">Log in with Venmo</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log in with Venmo</DialogTitle>
                <DialogDescription>Mock connection for demonstration purposes.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleConnect} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="venmoHandle">Venmo handle</Label>
                  <Input
                    id="venmoHandle"
                    placeholder="@your-handle"
                    value={venmoHandle}
                    onChange={(e) => setVenmoHandle(e.target.value)}
                  />
                  {error && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full">Continue</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        ) : (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Connected</AlertTitle>
            <AlertDescription className="text-green-700">
              Funds will be sent to your Venmo handle {connectedHandle}.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
