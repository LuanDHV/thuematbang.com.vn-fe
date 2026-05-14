import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

type PageFaqProps = {
  title: string;
  description: string;
  items: FaqItem[];
};

export default function PageFaq({ title, description, items }: PageFaqProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:py-20">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-700 sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-lg text-gray-600">{description}</p>
      </div>

      <Accordion
        type="single"
        collapsible
        className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
      >
        {items.map((faq) => (
          <AccordionItem
            key={faq.id}
            value={faq.id}
            className="border-b border-gray-200 px-6 last:border-b-0"
          >
            <AccordionTrigger className="hover:text-primary cursor-pointer py-5 text-left font-semibold text-gray-700 transition-colors hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="pb-5 leading-relaxed text-gray-600">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
