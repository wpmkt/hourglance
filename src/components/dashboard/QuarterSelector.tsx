import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Quarter {
  id: string;
  title: string;
}

interface QuarterSelectorProps {
  quarters: Quarter[];
  selectedQuarter: string;
  onQuarterChange: (quarter: string) => void;
}

export const QuarterSelector = ({ quarters, selectedQuarter, onQuarterChange }: QuarterSelectorProps) => {
  return (
    <Tabs value={selectedQuarter} onValueChange={onQuarterChange} className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-2 w-full gap-6 bg-transparent p-0">
        {quarters.map((quarter) => (
          <TabsTrigger
            key={quarter.id}
            value={quarter.id}
            className={`text-base p-6 rounded-xl transition-all border ${
              selectedQuarter === quarter.id
                ? "bg-white text-primary border-primary shadow-lg"
                : "bg-white hover:bg-neutral-50 border-neutral-100"
            }`}
          >
            {quarter.title}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};