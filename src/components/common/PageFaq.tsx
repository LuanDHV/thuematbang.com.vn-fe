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
    <section className="layout-container layout-section-sm">
      <div className="mb-10 text-center">
        <h2 className="text-heading text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          {title}
        </h2>
        <p className="text-secondary mt-4 text-base leading-8 md:text-lg">
          {description}
        </p>
      </div>

      <Accordion
        type="single"
        collapsible
        className="surface-card w-full overflow-hidden"
      >
        {items.map((faq) => (
          <AccordionItem
            key={faq.id}
            value={faq.id}
            className="border-b border-black/6 px-6 last:border-b-0"
          >
            <AccordionTrigger className="text-heading hover:text-primary cursor-pointer py-5 text-left font-semibold transition-colors hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-body pb-5 leading-7">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

