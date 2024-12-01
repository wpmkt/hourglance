import Layout from "@/components/Layout";
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
        <div className="flex justify-end items-center mb-8">
          <select className="bg-white border border-neutral-200 rounded-xl px-4 py-2 text-sm font-medium text-neutral-700 hover:border-neutral-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20">
            {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((quarter) => (
            <div
              key={quarter}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-neutral-100"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {quarter}º Trimestre
                  </h3>
                  <span className="bg-neutral-50 px-3 py-1 rounded-lg text-sm text-neutral-600">
                    {currentYear}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">Horas previstas</p>
                    <p className="text-2xl font-bold text-neutral-900">480h</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">Horas trabalhadas</p>
                    <p className="text-2xl font-bold text-neutral-900">485h</p>
                  </div>

                  <div className="pt-2 border-t border-neutral-100">
                    <p className="text-sm text-neutral-500 mb-1">Saldo</p>
                    <p className="text-2xl font-bold text-success">+5h</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

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
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-neutral-500">Horas previstas</p>
                      <span className="text-sm font-medium text-neutral-700">160h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-neutral-500">Horas trabalhadas</p>
                      <span className="text-sm font-medium text-neutral-700">165h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-neutral-500">Saldo</p>
                      <span className="text-sm font-medium text-success">+5h</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;