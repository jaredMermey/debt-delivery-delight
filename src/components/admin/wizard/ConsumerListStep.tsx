import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Upload, Trash2, Users, DollarSign, FileUp } from "lucide-react";
import { Campaign, Consumer } from "@/types/campaign";

interface ConsumerListStepProps {
  data: Partial<Campaign>;
  onUpdate: (updates: Partial<Campaign>) => void;
}

export function ConsumerListStep({ data, onUpdate }: ConsumerListStepProps) {
  const consumers = data.consumers || [];
  const [newConsumer, setNewConsumer] = useState({ name: '', email: '', amount: 0 });
  const [uploadedData, setUploadedData] = useState<Consumer[]>([]);

  const addConsumer = () => {
    if (newConsumer.name && newConsumer.email && newConsumer.amount > 0) {
      const consumer: Consumer = {
        id: Math.random().toString(36).substr(2, 9),
        ...newConsumer
      };
      
      onUpdate({ 
        consumers: [...consumers, consumer] 
      });
      
      setNewConsumer({ name: '', email: '', amount: 0 });
    }
  };

  const removeConsumer = (id: string) => {
    onUpdate({ 
      consumers: consumers.filter(c => c.id !== id) 
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        // Skip header row if present
        const startIndex = lines[0].toLowerCase().includes('name') || 
                          lines[0].toLowerCase().includes('email') ? 1 : 0;
        
        const parsedConsumers: Consumer[] = [];
        
        for (let i = startIndex; i < lines.length; i++) {
          const columns = lines[i].split(',').map(col => col.trim().replace(/"/g, ''));
          
          if (columns.length >= 3) {
            const [name, email, amountStr] = columns;
            const amount = parseFloat(amountStr);
            
            if (name && email && !isNaN(amount) && amount > 0) {
              parsedConsumers.push({
                id: Math.random().toString(36).substr(2, 9),
                name: name.trim(),
                email: email.trim(),
                amount
              });
            }
          }
        }
        
        setUploadedData(parsedConsumers);
      } catch (error) {
        alert('Error parsing CSV file. Please check the format.');
      }
    };
    
    reader.readAsText(file);
  };

  const importUploadedData = () => {
    onUpdate({ 
      consumers: [...consumers, ...uploadedData] 
    });
    setUploadedData([]);
  };

  const totalAmount = consumers.reduce((sum, consumer) => sum + consumer.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-foreground">Consumer List Management</CardTitle>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{consumers.length} consumers</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span>{formatCurrency(totalAmount)} total</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="manual" className="w-full">
          <TabsList>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="upload">File Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-border rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                <Input
                  id="name"
                  value={newConsumer.name}
                  onChange={(e) => setNewConsumer(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Consumer name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newConsumer.email}
                  onChange={(e) => setNewConsumer(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="consumer@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newConsumer.amount || ''}
                  onChange={(e) => setNewConsumer(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={addConsumer}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={!newConsumer.name || !newConsumer.email || newConsumer.amount <= 0}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="border border-border rounded-lg p-6 text-center space-y-4">
              <FileUp className="mx-auto h-8 w-8 text-muted-foreground" />
              <div>
                <h4 className="font-medium text-foreground mb-2">Upload Consumer List</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a CSV file with columns: Name, Email, Amount
                </p>
                <label className="cursor-pointer">
                  <Button variant="outline" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Choose CSV File
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {uploadedData.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">Preview Uploaded Data</h4>
                  <Button 
                    onClick={importUploadedData}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Import {uploadedData.length} Consumers
                  </Button>
                </div>
                <div className="max-h-64 overflow-y-auto border border-border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {uploadedData.map((consumer, index) => (
                        <TableRow key={index}>
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
          </TabsContent>
        </Tabs>

        {consumers.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Consumer List</h4>
              <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                {consumers.length} consumers • {formatCurrency(totalAmount)} total
              </Badge>
            </div>
            
            <div className="border border-border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consumers.map((consumer) => (
                    <TableRow key={consumer.id}>
                      <TableCell className="font-medium">{consumer.name}</TableCell>
                      <TableCell>{consumer.email}</TableCell>
                      <TableCell>{formatCurrency(consumer.amount)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeConsumer(consumer.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No consumers added yet. Add consumers manually or upload a CSV file.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}