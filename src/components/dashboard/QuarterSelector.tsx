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
      <TabsList className="grid grid-cols-2 md:grid-cols-2 w-full gap-4">
        {quarters.map((quarter, index) => (
          <TabsTrigger
            key={quarter.id}
            value={quarter.id}
            className={`text-sm p-4 rounded-xl transition-all ${
              selectedQuarter === quarter.id
                ? "bg-primary text-white shadow-lg scale-105"
                : `hover:bg-neutral-100 bg-white`
            }`}
          >
            {quarter.title}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};