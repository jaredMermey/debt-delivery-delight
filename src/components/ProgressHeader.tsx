
import { Progress } from "@/components/ui/progress";

interface ProgressHeaderProps {
  currentStep: number;
  progressValue: number;
}

export const ProgressHeader = ({ currentStep, progressValue }: ProgressHeaderProps) => {
  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <img
          src="/lovable-uploads/0ee1b531-08da-4831-95df-14752bf2d87e.png"
          alt="Axos Bank logo"
          className="mx-auto h-10 w-auto mb-4"
          loading="lazy"
        />
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
