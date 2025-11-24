import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Eye, ArrowLeft, ArrowRight } from "lucide-react";
import { BasicDetailsStep } from "@/components/admin/wizard/BasicDetailsStep";
import { PaymentMethodsStep } from "@/components/admin/wizard/PaymentMethodsStep";
import { AdvertisementStep } from "@/components/admin/wizard/AdvertisementStep";
import { ConsumerListStep } from "@/components/admin/wizard/ConsumerListStep";
import { ReviewStep } from "@/components/admin/wizard/ReviewStep";
import { Campaign, PaymentMethodConfig, Consumer } from "@/types/campaign";
import { useCurrentUserEntity } from "@/hooks/useEntities";
import { useCreateCampaign, useUpdateCampaign, useCampaign } from "@/hooks/useCampaigns";
import { toast } from "sonner";

const DEFAULT_PAYMENT_METHODS: PaymentMethodConfig[] = [
  { type: 'ach', enabled: true, fee_type: 'dollar', fee_amount: 0, display_order: 1 },
  { type: 'check', enabled: true, fee_type: 'dollar', fee_amount: 0, display_order: 2 },
  { type: 'prepaid', enabled: true, fee_type: 'dollar', fee_amount: 0, display_order: 3 },
  { type: 'realtime', enabled: false, fee_type: 'dollar', fee_amount: 0, display_order: 4 },
  { type: 'paypal', enabled: false, fee_type: 'dollar', fee_amount: 0, display_order: 5 },
  { type: 'venmo', enabled: false, fee_type: 'dollar', fee_amount: 0, display_order: 6 },
  { type: 'zelle', enabled: false, fee_type: 'dollar', fee_amount: 0, display_order: 7 },
  { type: 'crypto', enabled: false, fee_type: 'dollar', fee_amount: 0, display_order: 8 },
  { type: 'international', enabled: false, fee_type: 'dollar', fee_amount: 0, display_order: 9 },
];

export function CampaignWizard() {
  const navigate = useNavigate();
  const { campaignId } = useParams();
  const isEditMode = Boolean(campaignId);
  const [currentStep, setCurrentStep] = useState(1);
  const [createdCampaignId, setCreatedCampaignId] = useState<string | null>(null);
  
  const { data: currentEntity } = useCurrentUserEntity();
  const { data: existingCampaign, isLoading: isLoadingCampaign } = useCampaign(campaignId);
  const createCampaign = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();
  
  const [campaignData, setCampaignData] = useState<Partial<Campaign>>({
    name: '',
    description: '',
    bank_logo: '',
    entity_id: currentEntity?.id || '',
    payment_methods: DEFAULT_PAYMENT_METHODS,
    advertisement_image: '',
    advertisement_url: '',
    advertisement_enabled: true,
    consumers: []
  });

  // Update entity_id when currentEntity loads
  useEffect(() => {
    if (currentEntity?.id && !campaignData.entity_id) {
      setCampaignData(prev => ({ ...prev, entity_id: currentEntity.id }));
    }
  }, [currentEntity, campaignData.entity_id]);

  // Load existing campaign data when in edit mode
  useEffect(() => {
    if (isEditMode && existingCampaign) {
      setCampaignData(existingCampaign);
    }
  }, [isEditMode, existingCampaign]);

  const totalSteps = 5;
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const stepTitles = [
    'Basic Details',
    'Payment Methods',
    'Advertisement',
    'Consumer List',
    'Review & Send'
  ];

  const updateCampaignData = (updates: Partial<Campaign>) => {
    setCampaignData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      // If moving to ReviewStep (step 5) and no campaign exists yet, create it
      if (currentStep === 4 && !campaignId && !createdCampaignId) {
        try {
          const result = await createCampaign.mutateAsync({
            name: campaignData.name!,
            description: campaignData.description!,
            bank_logo: campaignData.bank_logo!,
            entity_id: campaignData.entity_id!,
            payment_methods: campaignData.payment_methods!,
            advertisement_image: campaignData.advertisement_image || '',
            advertisement_url: campaignData.advertisement_url || '',
            advertisement_enabled: campaignData.advertisement_enabled ?? true,
            consumers: campaignData.consumers!
          });
          setCreatedCampaignId(result.id);
          toast.success("Campaign created successfully");
        } catch (error) {
          toast.error("Failed to create campaign");
          return;
        }
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePreview = async () => {
    if (isEditMode && campaignId) {
      navigate(`/admin/preview/${campaignId}`);
    } else if (createdCampaignId) {
      navigate(`/admin/preview/${createdCampaignId}`);
    } else {
      // Create a temporary campaign for preview
      try {
        const result = await createCampaign.mutateAsync({
          name: campaignData.name || 'Preview Campaign',
          description: campaignData.description || 'Preview description',
          bank_logo: campaignData.bank_logo || '',
          entity_id: campaignData.entity_id!,
          payment_methods: campaignData.payment_methods || DEFAULT_PAYMENT_METHODS,
          advertisement_image: campaignData.advertisement_image || '',
          advertisement_url: campaignData.advertisement_url || '',
          advertisement_enabled: campaignData.advertisement_enabled ?? true,
          consumers: campaignData.consumers || []
        });
        setCreatedCampaignId(result.id);
        navigate(`/admin/preview/${result.id}`);
      } catch (error) {
        toast.error("Failed to create preview");
      }
    }
  };

  const handleComplete = () => {
    // Campaign is already created/updated, just navigate to dashboard
    toast.success("Campaign saved successfully");
    navigate('/admin');
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return campaignData.name && campaignData.description && campaignData.bank_logo;
      case 2:
        return campaignData.payment_methods?.some(pm => pm.enabled);
      case 3:
        return true; // Advertisement is optional
      case 4:
        return campaignData.consumers && campaignData.consumers.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicDetailsStep 
            data={campaignData} 
            onUpdate={updateCampaignData}
          />
        );
      case 2:
        return (
          <PaymentMethodsStep 
            data={campaignData} 
            onUpdate={updateCampaignData}
          />
        );
      case 3:
        return (
          <AdvertisementStep 
            data={campaignData} 
            onUpdate={updateCampaignData}
          />
        );
      case 4:
        return (
          <ConsumerListStep 
            data={campaignData} 
            onUpdate={updateCampaignData}
          />
        );
      case 5:
        const reviewData = {
          ...campaignData,
          id: campaignId || createdCampaignId || '',
        } as Campaign;
        
        return (
          <ReviewStep 
            data={reviewData} 
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEditMode ? 'Edit Campaign' : 'Create New Campaign'}
          </h1>
          <p className="text-muted-foreground mt-2">
            Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
          </p>
        </div>
        <Button variant="outline" onClick={handlePreview}>
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          {stepTitles.map((title, index) => (
            <span 
              key={title} 
              className={index + 1 <= currentStep ? 'text-foreground font-medium' : ''}
            >
              {title}
            </span>
          ))}
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      {/* Step Content */}
      <div className="min-h-[500px]">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <Button 
          variant="outline" 
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <div className="flex gap-2">
          {currentStep < totalSteps && (
            <Button 
              onClick={handleNext}
              disabled={!isStepValid()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
