import Layout from "@/components/Layout";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

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
  const currentQuarter = Math.floor((new Date().getMonth() / 3)) + 1;
  const [selectedQuarter, setSelectedQuarter] = useState(currentQuarter.toString());

  const quarters = [
    {
      id: "1",
      title: "1º Trimestre",
      hours: { planned: 480, worked: 485, balance: 5 },
      months: months.slice(0, 3)
    },
    {
      id: "2",
      title: "2º Trimestre",
      hours: { planned: 480, worked: 485, balance: 5 },
      months: months.slice(3, 6)
    },
    {
      id: "3",
      title: "3º Trimestre",
      hours: { planned: 480, worked: 485, balance: 5 },
      months: months.slice(6, 9)
    },
    {
      id: "4",
      title: "4º Trimestre",
      hours: { planned: 480, worked: 485, balance: 5 },
      months: months.slice(9, 12)
    }
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Tabs defaultValue={selectedQuarter} value={selectedQuarter} onValueChange={setSelectedQuarter} className="w-full col-span-1 md:col-span-2">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-6">
              {quarters.map((quarter) => (
                <TabsTrigger key={quarter.id} value={quarter.id} className="text-sm">
                  {quarter.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {quarters.map((quarter) => (
              <TabsContent key={quarter.id} value={quarter.id} className="mt-0">
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-neutral-100">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {quarter.title}
                      </h3>
                      <span className="bg-neutral-50 px-3 py-1 rounded-lg text-sm text-neutral-600">
                        {currentYear}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-neutral-50 p-4 rounded-xl">
                        <p className="text-sm text-neutral-500 mb-1">Horas previstas</p>
                        <p className="text-xl font-bold text-neutral-900">{quarter.hours.planned}h</p>
                      </div>
                      
                      <div className="bg-neutral-50 p-4 rounded-xl">
                        <p className="text-sm text-neutral-500 mb-1">Horas trabalhadas</p>
                        <p className="text-xl font-bold text-neutral-900">{quarter.hours.worked}h</p>
                      </div>

                      <div className="bg-neutral-50 p-4 rounded-xl">
                        <p className="text-sm text-neutral-500 mb-1">Saldo</p>
                        <p className="text-xl font-bold text-success">+{quarter.hours.balance}h</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
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