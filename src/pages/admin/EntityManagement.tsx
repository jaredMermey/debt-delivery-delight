import { useState } from "react";
import { Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEntities } from "@/hooks/useEntities";
import { useBranding } from "@/contexts/BrandingContext";
import { CreateEntityDialog } from "@/components/admin/CreateEntityDialog";
import { Entity } from "@/types/campaign";

export function EntityManagement() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { data: entities, isLoading } = useEntities();
  const { currentEntity } = useBranding();

  // Organize entities by type
  const rootEntity = entities?.find(e => e.type === 'root');
  const distributors = entities?.filter(e => e.type === 'distributor') || [];
  const customers = entities?.filter(e => e.type === 'customer') || [];

  // Group customers by parent distributor
  const customersByDistributor = customers.reduce((acc, customer) => {
    const parentId = customer.parent_entity_id || 'root';
    if (!acc[parentId]) acc[parentId] = [];
    acc[parentId].push(customer);
    return acc;
  }, {} as Record<string, Entity[]>);

  const getEntityTypeColor = (type: string) => {
    switch (type) {
      case 'root': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'distributor': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'customer': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading entities...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Entity Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your organizational hierarchy
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Entity
        </Button>
      </div>

      <div className="space-y-6">
        {/* Root Entity */}
        {rootEntity && (
          <Card className="border-2 border-purple-500/20">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {rootEntity.logo && (
                    <img src={rootEntity.logo} alt={rootEntity.name} className="h-12 w-12 rounded object-contain" />
                  )}
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {rootEntity.name}
                      <Badge variant="outline" className={getEntityTypeColor('root')}>
                        Root
                      </Badge>
                    </CardTitle>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Distributors */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Distributors
          </h2>
          {distributors.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No distributors yet
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {distributors.map(distributor => (
                <Card key={distributor.id} className="border-2 border-blue-500/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {distributor.logo && (
                          <img src={distributor.logo} alt={distributor.name} className="h-10 w-10 rounded object-contain" />
                        )}
                        <div>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            {distributor.name}
                            <Badge variant="outline" className={getEntityTypeColor('distributor')}>
                              Distributor
                            </Badge>
                          </CardTitle>
                          {distributor.brand_color && (
                            <div className="flex items-center gap-2 mt-1">
                              <div 
                                className="h-4 w-4 rounded border border-border" 
                                style={{ backgroundColor: distributor.brand_color }}
                              />
                              <span className="text-xs text-muted-foreground">{distributor.brand_color}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Customers under this distributor */}
                  {customersByDistributor[distributor.id] && customersByDistributor[distributor.id].length > 0 && (
                    <CardContent className="border-t pt-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Customers</h3>
                        <div className="grid gap-2">
                          {customersByDistributor[distributor.id].map(customer => (
                            <div key={customer.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                              {customer.logo && (
                                <img src={customer.logo} alt={customer.name} className="h-8 w-8 rounded object-contain" />
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{customer.name}</span>
                                  <Badge variant="outline" className={`${getEntityTypeColor('customer')} text-xs`}>
                                    Customer
                                  </Badge>
                                </div>
                                {customer.brand_color && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <div 
                                      className="h-3 w-3 rounded border border-border" 
                                      style={{ backgroundColor: customer.brand_color }}
                                    />
                                    <span className="text-xs text-muted-foreground">{customer.brand_color}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Customers under root */}
        {customersByDistributor['root'] && customersByDistributor['root'].length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Direct Customers (Root Level)</h2>
            <div className="grid gap-2">
              {customersByDistributor['root'].map(customer => (
                <Card key={customer.id} className="border-2 border-green-500/20">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {customer.logo && (
                        <img src={customer.logo} alt={customer.name} className="h-10 w-10 rounded object-contain" />
                      )}
                      <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          {customer.name}
                          <Badge variant="outline" className={getEntityTypeColor('customer')}>
                            Customer
                          </Badge>
                        </CardTitle>
                        {customer.brand_color && (
                          <div className="flex items-center gap-2 mt-1">
                            <div 
                              className="h-4 w-4 rounded border border-border" 
                              style={{ backgroundColor: customer.brand_color }}
                            />
                            <span className="text-xs text-muted-foreground">{customer.brand_color}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <CreateEntityDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}