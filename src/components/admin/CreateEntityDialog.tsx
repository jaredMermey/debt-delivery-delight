import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateEntity, useEntities } from "@/hooks/useEntities";
import { useBranding } from "@/contexts/BrandingContext";

interface CreateEntityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateEntityDialog({ open, onOpenChange }: CreateEntityDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"distributor" | "customer">("customer");
  const [parentEntityId, setParentEntityId] = useState("");
  const [logo, setLogo] = useState("");
  const [brandColor, setBrandColor] = useState("#000000");

  const { data: entities } = useEntities();
  const { currentEntity } = useBranding();
  const createEntity = useCreateEntity();

  const rootEntity = entities?.find(e => e.type === 'root');
  const distributors = entities?.filter(e => e.type === 'distributor') || [];
  const isRootUser = currentEntity?.type === 'root';
  const isDistributorUser = currentEntity?.type === 'distributor';

  // Set default parent based on user type
  useEffect(() => {
    if (open) {
      if (isDistributorUser && currentEntity) {
        // Distributor users: parent is always their own entity
        setParentEntityId(currentEntity.id);
        setType("customer"); // Can only create customers
      } else if (isRootUser && rootEntity) {
        // Root users: default to root as parent
        setParentEntityId(rootEntity.id);
      }
    }
  }, [open, isRootUser, isDistributorUser, currentEntity, rootEntity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createEntity.mutateAsync({
      name,
      type,
      parent_entity_id: parentEntityId || null,
      logo,
      brand_color: brandColor,
    });

    // Reset form
    setName("");
    setType("customer");
    setParentEntityId("");
    setLogo("");
    setBrandColor("#000000");
    onOpenChange(false);
  };

  // Determine available parent options
  const getParentOptions = () => {
    if (isDistributorUser) {
      // Distributor users: no choice, parent is their entity
      return null;
    }

    if (type === "distributor") {
      // Distributors can only have root as parent
      return rootEntity ? [rootEntity] : [];
    }

    if (type === "customer") {
      // Customers can have distributors or root as parent
      const options = [];
      if (rootEntity) options.push(rootEntity);
      options.push(...distributors);
      return options;
    }

    return [];
  };

  const parentOptions = getParentOptions();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Entity</DialogTitle>
            <DialogDescription>
              {isRootUser && "Create a new distributor or customer entity."}
              {isDistributorUser && "Create a new customer entity under your organization."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Entity Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter entity name"
                required
              />
            </div>

            {isRootUser && (
              <div className="space-y-2">
                <Label htmlFor="type">Entity Type *</Label>
                <Select value={type} onValueChange={(value: "distributor" | "customer") => {
                  setType(value);
                  // Reset parent when type changes
                  if (value === "distributor" && rootEntity) {
                    setParentEntityId(rootEntity.id);
                  } else {
                    setParentEntityId("");
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distributor">Distributor</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {isDistributorUser && (
              <div className="space-y-2">
                <Label>Entity Type</Label>
                <div className="px-3 py-2 border rounded-md bg-muted text-muted-foreground">
                  Customer
                </div>
              </div>
            )}

            {parentOptions && parentOptions.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="parent">Parent Entity *</Label>
                <Select value={parentEntityId} onValueChange={setParentEntityId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent entity" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentOptions.map(entity => (
                      <SelectItem key={entity.id} value={entity.id}>
                        {entity.name} ({entity.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {isDistributorUser && currentEntity && (
              <div className="space-y-2">
                <Label>Parent Entity</Label>
                <div className="px-3 py-2 border rounded-md bg-muted text-muted-foreground">
                  {currentEntity.name} (Your Organization)
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                placeholder="https://example.com/logo.png"
              />
              {logo && (
                <div className="mt-2 p-2 border rounded-md">
                  <img src={logo} alt="Logo preview" className="h-12 w-auto object-contain" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandColor">Brand Color</Label>
              <div className="flex gap-2">
                <Input
                  id="brandColor"
                  type="color"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createEntity.isPending}>
              {createEntity.isPending ? "Creating..." : "Create Entity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}