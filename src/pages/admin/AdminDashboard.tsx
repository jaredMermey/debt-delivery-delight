import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { campaignStore } from "@/lib/campaignStore";
import { Eye, Edit, Plus, Trash2, Users, DollarSign, BarChart3 } from "lucide-react";

export function AdminDashboard() {
  const campaigns = campaignStore.getAllCampaigns();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-muted text-muted-foreground';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-emerald-100 text-emerald-800';
      case 'completed': return 'bg-slate-100 text-slate-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCampaignActions = (campaign: any) => {
    const isDraft = campaign.status === 'draft';
    const isSent = ['sent', 'active', 'completed'].includes(campaign.status);

    return (
      <div className="flex gap-2">
        <Link to={`/admin/preview/${campaign.id}`}>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </Link>
        
        {isDraft && (
          <Link to={`/admin/campaign/${campaign.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
        )}
        
        {isSent && (
          <Link to={`/admin/campaign/${campaign.id}/reports`}>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Reports
            </Button>
          </Link>
        )}
        
        {isDraft && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              if (confirm('Are you sure you want to delete this campaign?')) {
                campaignStore.deleteCampaign(campaign.id);
                window.location.reload();
              }
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campaign Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor your settlement campaigns
          </p>
        </div>
        <Link to="/admin/campaign/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No campaigns yet</h3>
              <p className="text-muted-foreground max-w-md">
                Create your first settlement campaign to get started with distributing payments to consumers.
              </p>
              <Link to="/admin/campaign/new">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Create First Campaign
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {campaigns.map((campaign) => {
            const totalDisbursement = campaignStore.getTotalDisbursement(campaign.id);
            const consumerCount = campaign.consumers.length;
            
            return (
              <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-xl text-foreground">{campaign.name}</CardTitle>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{campaign.description}</p>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{consumerCount} consumers</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{formatCurrency(totalDisbursement)} total</span>
                        </div>
                        <span>Created {campaign.createdAt.toLocaleDateString()}</span>
                        {campaign.sentAt && (
                          <span>Sent {campaign.sentAt.toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    {getCampaignActions(campaign)}
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}