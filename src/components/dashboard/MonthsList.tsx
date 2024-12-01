import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface MonthsListProps {
  months: string[];
}

export const MonthsList = ({ months }: MonthsListProps) => {
  return (
    <div className="mt-12">
      <h2 className="text-lg font-semibold text-neutral-900 mb-6">Meses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {months.map((month, index) => (
          <Link
            key={month}
            to={`/month/${index + 1}`}
            className="group block"
          >
            <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-neutral-100 group-hover:border-primary">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-medium text-neutral-900">{month}</h3>
                <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-primary transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};