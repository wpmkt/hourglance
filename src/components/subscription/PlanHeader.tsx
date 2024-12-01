import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PlanHeaderProps {
  name: string;
  description: string;
  price: number;
  currency: string;
}

export const PlanHeader = ({ name, description, price, currency }: PlanHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle className="text-2xl font-bold">{name}</CardTitle>
      <CardDescription className="mt-2">{description}</CardDescription>
      <div className="mt-4">
        <span className="text-3xl font-bold text-primary">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency,
          }).format(price / 100)}
        </span>
        <span className="text-neutral-500 ml-2">/mês</span>
      </div>
    </CardHeader>
  );
};