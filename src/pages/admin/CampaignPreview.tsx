import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Eye } from "lucide-react";
import { campaignStore } from "@/lib/campaignStore";
import { ConsumerInterface } from "@/components/ConsumerInterface";

export function CampaignPreview() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  
  const campaign = campaignId ? campaignStore.getCampaign(campaignId) : null;

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-foreground mb-4">Campaign Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The campaign you're looking for doesn't exist or has been deleted.
        </p>
        <Button onClick={() => navigate('/admin')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Preview Header */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold text-emerald-800">Campaign Preview</span>
            </div>
            <Badge variant="outline" className="text-emerald-700 border-emerald-300">
              {campaign.name}
            </Badge>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
            <Button 
              onClick={() => navigate(`/admin/campaign/${campaign.id}/edit`)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Campaign
            </Button>
          </div>
        </div>
        
        <p className="text-sm text-emerald-700 mt-2">
          This is how consumers will see the payment interface for this campaign.
        </p>
      </div>

      {/* Consumer Interface */}
      <div className="border border-border rounded-lg overflow-hidden">
        <ConsumerInterface campaign={campaign} />
      </div>
    </div>
  );
}