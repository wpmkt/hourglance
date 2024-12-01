import { Check } from "lucide-react";

interface PlanFeaturesProps {
  features: string[];
}

export const PlanFeatures = ({ features }: PlanFeaturesProps) => {
  return (
    <ul className="space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-2">
          <Check className="h-5 w-5 text-success" />
          <span className="text-neutral-600">{feature}</span>
        </li>
      ))}
    </ul>
  );
};