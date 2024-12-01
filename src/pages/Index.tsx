import Layout from "@/components/Layout";
import Card from "@/components/Card";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const Index = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
          <select className="bg-white border border-neutral-300 rounded-md px-3 py-2 text-sm">
            {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((quarter) => (
            <Card key={quarter} className="hover:border-primary transition-colors">
              <div className="text-center">
                <h3 className="text-lg font-medium text-neutral-900 mb-4">
                  {quarter}º Trimestre
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-neutral-500">
                    Horas previstas: <span className="font-medium">480h</span>
                  </p>
                  <p className="text-sm text-neutral-500">
                    Horas trabalhadas: <span className="font-medium">485h</span>
                  </p>
                  <p className="text-sm text-success">
                    Saldo: <span className="font-medium">+5h</span>
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {months.map((month, index) => (
            <Link
              key={month}
              to={`/month/${index + 1}`}
              className="group block"
            >
              <Card className="group-hover:border-primary transition-colors">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-neutral-900">{month}</h3>
                  <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-primary transition-colors" />
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-sm text-neutral-500">
                    Horas previstas: <span className="font-medium">160h</span>
                  </p>
                  <p className="text-sm text-neutral-500">
                    Horas trabalhadas: <span className="font-medium">165h</span>
                  </p>
                  <p className="text-sm text-success">
                    Saldo: <span className="font-medium">+5h</span>
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;