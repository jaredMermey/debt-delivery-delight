
import { Progress } from "@/components/ui/progress";
import axosBankLogo from "@/assets/axos-bank-logo.png";

interface ProgressHeaderProps {
  currentStep: number;
  progressValue: number;
  bankLogo?: string;
}

export const ProgressHeader = ({ currentStep, progressValue, bankLogo }: ProgressHeaderProps) => {
  return (
    <>
      {/* Brand Logo */}
      <div className="flex justify-center mb-6">
        <img 
          src={bankLogo || axosBankLogo} 
          alt="Brand Logo" 
          className="h-20 w-auto"
        />
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-3">
          Hi David, How Do You Want to Get Paid?
        </h1>
        <p className="text-slate-600 text-lg font-medium">
          Choose how you'd like to receive your settlement funds
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-slate-600 mb-2 font-medium">
          <span>Step {currentStep} of 3</span>
          <span>{Math.round(progressValue)}% Complete</span>
        </div>
        <Progress value={progressValue} className="h-3 bg-gray-200" />
      </div>
    </>
  );
};
