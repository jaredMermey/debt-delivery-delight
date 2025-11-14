
import { Progress } from "@/components/ui/progress";
import coterieLogo from "@/assets/coterie-logo.png";

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
          src={bankLogo || coterieLogo} 
          alt="Coterie Logo" 
          className="h-20 w-auto"
        />
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">
          Hi Helen! You have $2,500.00 waiting for you.
        </h1>
        <p className="text-slate-600 text-xl font-semibold">
          How would you like to receive your payment?
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
