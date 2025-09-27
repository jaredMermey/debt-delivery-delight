import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, ExternalLink } from "lucide-react";
import { Campaign } from "@/types/campaign";

interface AdvertisementStepProps {
  data: Partial<Campaign>;
  onUpdate: (updates: Partial<Campaign>) => void;
}

export function AdvertisementStep({ data, onUpdate }: AdvertisementStepProps) {
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
      const url = URL.createObjectURL(file);
      onUpdate({ advertisementImage: url });
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
        <CardTitle className="text-xl text-foreground">Advertisement Configuration</CardTitle>
        <p className="text-sm text-muted-foreground">
          Add an optional advertisement that consumers will see during the payment process.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium text-foreground">
              Enable Advertisement
            </Label>
            <p className="text-sm text-muted-foreground">
              Show an advertisement card to consumers
            </p>
          </div>
          <Switch
            checked={data.advertisementEnabled ?? true}
            onCheckedChange={(advertisementEnabled) => onUpdate({ advertisementEnabled })}
          />
        </div>

        {data.advertisementEnabled && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Advertisement Image
              </Label>
              
              {data.advertisementImage ? (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img 
                      src={data.advertisementImage} 
                      alt="Advertisement" 
                      className="w-full max-w-sm border border-border rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onUpdate({ advertisementImage: '' })}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
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
                      Drop your advertisement image here, or{" "}
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
                      PNG, JPG, SVG up to 5MB. Square format recommended.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="adUrl" className="text-sm font-medium text-foreground">
                Click URL (Optional)
              </Label>
              <div className="relative">
                <Input
                  id="adUrl"
                  value={data.advertisementUrl || ''}
                  onChange={(e) => onUpdate({ advertisementUrl: e.target.value })}
                  placeholder="https://example.com"
                  className="pr-10"
                />
                {data.advertisementUrl && (
                  <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Where users will be directed when they click the advertisement
              </p>
            </div>

            {/* Preview Section */}
            {data.advertisementImage && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Preview</Label>
                <div className="border border-border rounded-lg p-4 max-w-sm bg-background">
                  <div className="aspect-square rounded-lg overflow-hidden mb-2">
                    <img 
                      src={data.advertisementImage} 
                      alt="Ad Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    {data.advertisementUrl ? (
                      <>Clickable advertisement</>
                    ) : (
                      <>Display only</>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-2">Advertisement Guidelines</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Use square images for best results</li>
            <li>• Keep file size under 5MB for faster loading</li>
            <li>• Ensure content is appropriate and relevant</li>
            <li>• Advertisement appears alongside payment methods</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}