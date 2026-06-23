import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import JsonLd from "@/components/common/JsonLd";
import { buildFaqPageSchema } from "@/lib/seo";
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

export default function PageFaq({ title, description, faqData }: PageFaqProps) {
  const items: FaqItem[] =
    faqData?.faqs?.map((item) => ({
      id: String(item.id),
      question: item.question,
      answer: item.answer,
    })) ?? [];

  if (items.length === 0) return null;

  const normalizedTitle = title?.trim() ?? "Câu hỏi thường gặp";
  const normalizedDescription = description?.trim() ?? "";

  return (
    <section className="layout-container pt-6 pb-8 md:pt-8 md:pb-10">
      <JsonLd
        data={buildFaqPageSchema(
          items.map((item) => ({
            question: item.question,
            answer: item.answer,
          })),
        )}
      />

      {normalizedTitle || normalizedDescription ? (
        <div className="section-intro-tight text-center">
          {normalizedTitle ? (
            <h2 className="text-heading text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              {normalizedTitle}
            </h2>
          ) : null}
          {normalizedDescription ? (
            <p className="text-secondary mt-3 text-sm leading-7 md:text-base">
              {normalizedDescription}
            </p>
          ) : null}
        </div>
      ) : null}

      <Accordion type="single" collapsible className="surface-editorial w-full overflow-hidden rounded-[1.75rem]">
        {items.map((faq) => (
          <AccordionItem
            key={faq.id}
            value={faq.id}
            className="border-hairline border-b px-6 last:border-b-0"
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
