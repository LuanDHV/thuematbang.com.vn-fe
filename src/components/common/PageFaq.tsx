import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqByPageResponse } from "@/types/faq";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

type PageFaqProps = {
  title?: string | null;
  description?: string | null;
  faqData?: FaqByPageResponse | null;
};

export default function PageFaq({
  title,
  description,
  faqData,
}: PageFaqProps) {
  const items: FaqItem[] =
    faqData?.faqs?.map((item) => ({
      id: String(item.id),
      question: item.question,
      answer: item.answer,
    })) ?? [];

  if (items.length === 0) return null;

  const normalizedTitle = title?.trim() ?? "";
  const normalizedDescription = description?.trim() ?? "";

  return (
    <section className="layout-container layout-section-sm">
      {normalizedTitle || normalizedDescription ? (
        <div className="mb-10 text-center">
          {normalizedTitle ? (
            <h2 className="text-heading text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              {normalizedTitle}
            </h2>
          ) : null}
          {normalizedDescription ? (
            <p className="text-secondary mt-4 text-base leading-8 md:text-lg">
              {normalizedDescription}
            </p>
          ) : null}
        </div>
      ) : null}

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
