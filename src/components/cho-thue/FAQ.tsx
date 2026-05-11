import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/mockData";

export default function FAQSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:py-20">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Câu hỏi thường gặp
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Giải đáp những thắc mắc phổ biến nhất về dịch vụ của chúng tôi.
        </p>
      </div>

      {/* Thêm border, rounded và overflow-hidden cho container tổng */}
      <Accordion
        type="single"
        collapsible
        className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
      >
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            // Sử dụng id từ dữ liệu hoặc index để làm value
            value={`item-${index}`}
            // last:border-b-0 giúp item cuối cùng không bị kẻ vạch đè lên border container
            className="border-b border-gray-200 px-6 last:border-b-0"
          >
            <AccordionTrigger className="hover:text-primary cursor-pointer py-5 text-left font-semibold text-gray-700 transition-colors duration-300 ease-in-out hover:no-underline">
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
