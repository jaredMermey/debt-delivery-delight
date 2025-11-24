import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { Campaign } from "@/types/campaign";

interface BasicDetailsStepProps {
  data: Partial<Campaign>;
  onUpdate: (updates: Partial<Campaign>) => void;
}

export function BasicDetailsStep({ data, onUpdate }: BasicDetailsStepProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        onUpdate({ bank_logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-foreground">Basic Campaign Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Campaign Name *
            </Label>
            <Input
              id="name"
              value={data.name || ''}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Enter campaign name"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-foreground">
              Campaign Description *
            </Label>
            <Textarea
              id="description"
              value={data.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Describe the purpose and details of this settlement campaign"
              rows={4}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Brand Logo *
            </Label>
            
            {data.bank_logo ? (
              <div className="relative inline-block">
                <img 
                  src={data.bank_logo} 
                  alt="Brand Logo" 
                  className="h-16 w-auto border border-border rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onUpdate({ bank_logo: '' })}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-emerald-400 bg-emerald-50' 
                    : 'border-border hover:border-emerald-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Drop your brand logo here, or{" "}
                    <label className="text-emerald-600 hover:text-emerald-700 cursor-pointer underline">
                      browse files
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileInput}
                      />
                    </label>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, SVG up to 5MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-2">What happens next?</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Configure which payment methods are available to consumers</li>
            <li>• Upload an advertisement image (optional)</li>
            <li>• Add consumers manually or via file upload</li>
            <li>• Review and send the campaign to consumers</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
