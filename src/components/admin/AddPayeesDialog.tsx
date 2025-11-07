import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { campaignStore } from '@/lib/campaignStore';
import { Consumer } from '@/types/campaign';
import { Upload, Plus, X, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddPayeesDialogProps {
  campaignId: string;
  campaignName: string;
  existingConsumerCount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface NewConsumer {
  name: string;
  email: string;
  amount: string;
}

export function AddPayeesDialog({
  campaignId,
  campaignName,
  existingConsumerCount,
  open,
  onOpenChange,
  onSuccess
}: AddPayeesDialogProps) {
  const { toast } = useToast();
  const [newConsumer, setNewConsumer] = useState<NewConsumer>({ name: '', email: '', amount: '' });
  const [pendingConsumers, setPendingConsumers] = useState<Omit<Consumer, 'id'>[]>([]);
  const [uploadedData, setUploadedData] = useState<Omit<Consumer, 'id'>[]>([]);

  const addConsumer = () => {
    if (!newConsumer.name || !newConsumer.email || !newConsumer.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(newConsumer.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate email in pending list
    if (pendingConsumers.some(c => c.email === newConsumer.email)) {
      toast({
        title: "Duplicate Email",
        description: "This email is already in the pending list",
        variant: "destructive"
      });
      return;
    }

    setPendingConsumers([...pendingConsumers, {
      name: newConsumer.name,
      email: newConsumer.email,
      amount
    }]);
    
    setNewConsumer({ name: '', email: '', amount: '' });
  };

  const removeConsumer = (email: string) => {
    setPendingConsumers(pendingConsumers.filter(c => c.email !== email));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const data: Omit<Consumer, 'id'>[] = [];

      // Skip header row, start from index 1
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [name, email, amountStr] = line.split(',').map(s => s.trim());
        const amount = parseFloat(amountStr);

        if (name && email && !isNaN(amount)) {
          data.push({ name, email, amount });
        }
      }

      setUploadedData(data);
    };

    reader.readAsText(file);
  };

  const importUploadedData = () => {
    // Filter out duplicates
    const newConsumers = uploadedData.filter(
      uploaded => !pendingConsumers.some(pending => pending.email === uploaded.email)
    );
    
    setPendingConsumers([...pendingConsumers, ...newConsumers]);
    setUploadedData([]);
    
    toast({
      title: "Data Imported",
      description: `${newConsumers.length} new consumers added to the list`
    });
  };

  const handleSubmit = () => {
    if (pendingConsumers.length === 0) {
      toast({
        title: "No Consumers",
        description: "Please add at least one consumer",
        variant: "destructive"
      });
      return;
    }

    // Add all pending consumers to the campaign
    let successCount = 0;
    pendingConsumers.forEach(consumer => {
      const result = campaignStore.addConsumer(campaignId, consumer);
      if (result) successCount++;
    });

    toast({
      title: "Payees Added",
      description: `Successfully added ${successCount} new payee${successCount !== 1 ? 's' : ''} to ${campaignName}`
    });

    // Reset state
    setPendingConsumers([]);
    setUploadedData([]);
    setNewConsumer({ name: '', email: '', amount: '' });

    // Notify parent and close
    onSuccess();
    onOpenChange(false);
  };

  const totalAmount = pendingConsumers.reduce((sum, c) => sum + c.amount, 0);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Add More Payees to {campaignName}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Currently {existingConsumerCount} payees in campaign. New payees will start with 'pending' status.
          </p>
        </DialogHeader>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="upload">CSV Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={newConsumer.name}
                      onChange={(e) => setNewConsumer({ ...newConsumer, name: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && addConsumer()}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={newConsumer.email}
                      onChange={(e) => setNewConsumer({ ...newConsumer, email: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && addConsumer()}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="100.00"
                        value={newConsumer.amount}
                        onChange={(e) => setNewConsumer({ ...newConsumer, amount: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && addConsumer()}
                      />
                      <Button onClick={addConsumer} size="icon">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <Label htmlFor="csv-upload" className="cursor-pointer">
                    <span className="text-sm font-medium text-foreground">Upload CSV File</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Format: name,email,amount (with header row)
                    </p>
                  </Label>
                  <Input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>

                {uploadedData.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Preview ({uploadedData.length} consumers)</p>
                      <Button onClick={importUploadedData} size="sm">
                        Import All
                      </Button>
                    </div>
                    <div className="max-h-64 overflow-y-auto border rounded">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {uploadedData.map((consumer, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{consumer.name}</TableCell>
                              <TableCell>{consumer.email}</TableCell>
                              <TableCell>{formatCurrency(consumer.amount)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Pending Consumers List */}
        {pendingConsumers.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">
                  Consumers to Add ({pendingConsumers.length}) - {formatCurrency(totalAmount)}
                </h3>
              </div>
              <div className="max-h-64 overflow-y-auto border rounded">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingConsumers.map((consumer) => (
                      <TableRow key={consumer.email}>
                        <TableCell>{consumer.name}</TableCell>
                        <TableCell>{consumer.email}</TableCell>
                        <TableCell>{formatCurrency(consumer.amount)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeConsumer(consumer.email)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={pendingConsumers.length === 0}>
            Add {pendingConsumers.length} Payee{pendingConsumers.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}