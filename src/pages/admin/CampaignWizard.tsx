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
import { campaignStore, DEFAULT_PAYMENT_METHODS } from "@/lib/campaignStore";
import { Campaign, PaymentMethodConfig, Consumer } from "@/types/campaign";
import { entityStore } from "@/lib/entityStore";

export function CampaignWizard() {
  const navigate = useNavigate();
  const { campaignId } = useParams();
  const isEditMode = Boolean(campaignId);
  const [currentStep, setCurrentStep] = useState(1);
  const [previewCampaignId, setPreviewCampaignId] = useState<string | null>(null);
  const currentEntity = entityStore.getCurrentUserEntity();
  const [campaignData, setCampaignData] = useState<Partial<Campaign>>({
    name: '',
    description: '',
    bankLogo: '',
    entityId: currentEntity?.id || 'entity-coterie',
    paymentMethods: DEFAULT_PAYMENT_METHODS,
    advertisementImage: '',
    advertisementUrl: '',
    advertisementEnabled: true,
    consumers: []
  });

  // Load existing campaign data when in edit mode or restore from sessionStorage
  useEffect(() => {
    const storageKey = `campaign-wizard-${campaignId || 'new'}`;
    const savedStep = sessionStorage.getItem(`${storageKey}-step`);
    const savedData = sessionStorage.getItem(`${storageKey}-data`);
    const savedPreviewId = sessionStorage.getItem(`${storageKey}-preview-id`);
    
    if (isEditMode && campaignId) {
      // Edit mode: load from store
      const existingCampaign = campaignStore.getCampaign(campaignId);
      if (existingCampaign) {
        setCampaignData(existingCampaign);
        
        // Restore step if returning from preview
        if (savedStep) {
          setCurrentStep(parseInt(savedStep, 10));
        }
      } else {
        // Campaign not found, redirect to dashboard
        navigate('/admin');
      }
    } else if (savedData) {
      // New campaign: restore from sessionStorage if returning from preview
      try {
        setCampaignData(JSON.parse(savedData));
        if (savedStep) {
          setCurrentStep(parseInt(savedStep, 10));
        }
        if (savedPreviewId) {
          setPreviewCampaignId(savedPreviewId);
        }
      } catch (error) {
        console.error('Failed to restore campaign data:', error);
      }
    }
    
    // Clean up sessionStorage after restoration
    if (savedStep) sessionStorage.removeItem(`${storageKey}-step`);
    if (savedData) sessionStorage.removeItem(`${storageKey}-data`);
    if (savedPreviewId) sessionStorage.removeItem(`${storageKey}-preview-id`);
  }, [campaignId, isEditMode, navigate]);

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

  const handleNext = () => {
    if (currentStep < totalSteps) {
      // If moving to ReviewStep (step 5) and no campaign exists yet, create it
      if (currentStep === 4 && !campaignId && !previewCampaignId) {
        const newCampaign = campaignStore.createCampaign({
          name: campaignData.name!,
          description: campaignData.description!,
          bankLogo: campaignData.bankLogo!,
          entityId: campaignData.entityId!,
          paymentMethods: campaignData.paymentMethods!,
          advertisementImage: campaignData.advertisementImage || '',
          advertisementUrl: campaignData.advertisementUrl || '',
          advertisementEnabled: campaignData.advertisementEnabled ?? true,
          consumers: campaignData.consumers!
        });
        setPreviewCampaignId(newCampaign.id);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePreview = () => {
    const storageKey = `campaign-wizard-${campaignId || 'new'}`;
    
    // Store step and data for returning from preview
    sessionStorage.setItem(`${storageKey}-step`, currentStep.toString());
    sessionStorage.setItem(`${storageKey}-data`, JSON.stringify(campaignData));
    
    if (isEditMode && campaignId) {
      // Use existing campaign for preview
      navigate(`/admin/preview/${campaignId}`);
    } else {
      // Reuse existing preview campaign or create new one
      let previewId = previewCampaignId;
      
      if (previewId) {
        // Update existing preview campaign
        campaignStore.updateCampaign(previewId, {
          name: campaignData.name || 'Preview Campaign',
          description: campaignData.description || 'Preview description',
          bankLogo: campaignData.bankLogo || '',
          paymentMethods: campaignData.paymentMethods || DEFAULT_PAYMENT_METHODS,
          advertisementImage: campaignData.advertisementImage || '',
          advertisementUrl: campaignData.advertisementUrl || '',
          advertisementEnabled: campaignData.advertisementEnabled ?? true,
          consumers: campaignData.consumers || []
        });
      } else {
        // Create new preview campaign
        const tempCampaign = campaignStore.createCampaign({
          name: campaignData.name || 'Preview Campaign',
          description: campaignData.description || 'Preview description',
          bankLogo: campaignData.bankLogo || '',
          entityId: campaignData.entityId!,
          paymentMethods: campaignData.paymentMethods || DEFAULT_PAYMENT_METHODS,
          advertisementImage: campaignData.advertisementImage || '',
          advertisementUrl: campaignData.advertisementUrl || '',
          advertisementEnabled: campaignData.advertisementEnabled ?? true,
          consumers: campaignData.consumers || []
        });
        previewId = tempCampaign.id;
        setPreviewCampaignId(previewId);
      }
      
      // Store preview ID for restoration
      sessionStorage.setItem(`${storageKey}-preview-id`, previewId);
      navigate(`/admin/preview/${previewId}`);
    }
  };

  const handleComplete = () => {
    const storageKey = `campaign-wizard-${campaignId || 'new'}`;
    
    if (isEditMode && campaignId) {
      // Update existing campaign
      campaignStore.updateCampaign(campaignId, {
        name: campaignData.name!,
        description: campaignData.description!,
        bankLogo: campaignData.bankLogo!,
        paymentMethods: campaignData.paymentMethods!,
        advertisementImage: campaignData.advertisementImage || '',
        advertisementUrl: campaignData.advertisementUrl || '',
        advertisementEnabled: campaignData.advertisementEnabled ?? true,
        consumers: campaignData.consumers!
      });
    } else if (previewCampaignId) {
      // Update the existing preview campaign (no duplicate created)
      campaignStore.updateCampaign(previewCampaignId, {
        name: campaignData.name!,
        description: campaignData.description!,
        bankLogo: campaignData.bankLogo!,
        paymentMethods: campaignData.paymentMethods!,
        advertisementImage: campaignData.advertisementImage || '',
        advertisementUrl: campaignData.advertisementUrl || '',
        advertisementEnabled: campaignData.advertisementEnabled ?? true,
        consumers: campaignData.consumers!
      });
    } else {
      // Create new campaign (only if no preview was created)
      campaignStore.createCampaign({
        name: campaignData.name!,
        description: campaignData.description!,
        bankLogo: campaignData.bankLogo!,
        entityId: campaignData.entityId!,
        paymentMethods: campaignData.paymentMethods!,
        advertisementImage: campaignData.advertisementImage || '',
        advertisementUrl: campaignData.advertisementUrl || '',
        advertisementEnabled: campaignData.advertisementEnabled ?? true,
        consumers: campaignData.consumers!
      });
    }

    // Clean up sessionStorage
    sessionStorage.removeItem(`${storageKey}-step`);
    sessionStorage.removeItem(`${storageKey}-data`);
    sessionStorage.removeItem(`${storageKey}-preview-id`);

    navigate('/admin');
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return campaignData.name && campaignData.description && campaignData.bankLogo;
      case 2:
        return campaignData.paymentMethods?.some(pm => pm.enabled);
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
        // Ensure campaign has an ID before showing ReviewStep
        const reviewData = {
          ...campaignData,
          id: campaignId || previewCampaignId || '',
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