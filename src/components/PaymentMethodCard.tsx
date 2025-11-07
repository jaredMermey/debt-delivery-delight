
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, LucideIcon } from "lucide-react";

interface PaymentMethod {
  id: "ach" | "check" | "realtime" | "prepaid" | "venmo" | "paypal" | "international";
  title: string;
  description: string;
  icon: LucideIcon;
  benefits: string[];
  estimatedTime: string;
  fee?: string;
}

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onSelect: (id: PaymentMethod["id"]) => void;
}

export const PaymentMethodCard = ({ method, onSelect }: PaymentMethodCardProps) => {
  const IconComponent = method.icon;
  
  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 border-2 hover:border-emerald-400 bg-white shadow-md relative overflow-hidden"
      onClick={() => onSelect(method.id)}
    >
      {method.fee && (
        <div className="absolute top-3 right-3 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
          {method.fee}
        </div>
      )}
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl text-slate-800 font-bold">{method.title}</CardTitle>
            <CardDescription className="text-sm text-slate-600 font-medium">
              {method.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm text-slate-600 font-medium">
            <strong className="text-slate-700">Estimated time:</strong> {method.estimatedTime}
          </div>
          <div className="space-y-1">
            {method.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center text-sm text-emerald-700 font-medium">
                <CheckCircle className="w-4 h-4 mr-2" />
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
