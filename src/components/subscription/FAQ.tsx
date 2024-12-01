import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Como funciona a cobrança?",
    answer: "A cobrança é feita mensalmente através do cartão de crédito cadastrado. Você pode cancelar a qualquer momento."
  },
  {
    question: "Posso cancelar quando quiser?",
    answer: "Sim! Você pode cancelar sua assinatura a qualquer momento, sem multa ou taxas adicionais."
  },
  {
    question: "Existe período de teste?",
    answer: "Sim, oferecemos 15 dias de teste grátis para você experimentar todos os recursos premium."
  },
  {
    question: "Como funciona o suporte?",
    answer: "Nosso suporte está disponível 24/7 via e-mail para assinantes premium, com tempo de resposta médio de 2 horas."
  }
];

export const FAQ = () => {
  return (
    <div className="max-w-2xl mx-auto mt-16">
      <h2 className="text-2xl font-bold text-center mb-8">Perguntas Frequentes</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};