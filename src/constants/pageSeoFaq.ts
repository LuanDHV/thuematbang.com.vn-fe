type SeoFaqItem = {
  id: string;
  question: string;
  answer: string;
};

type PageSeoFaqEntry = {
  seoContent: string;
  faqTitle: string;
  faqDescription: string;
  faqs: SeoFaqItem[];
};

const defaultFaqs: SeoFaqItem[] = [
  {
    id: "1",
    question: "Làm sao để bắt đầu tìm kiếm nhanh?",
    answer:
      "Bạn có thể chọn loại bất động sản, khu vực, khoảng giá và diện tích để lọc kết quả phù hợp nhất.",
  },
  {
    id: "2",
    question: "Thông tin hiển thị có được cập nhật thường xuyên không?",
    answer:
      "Dữ liệu được đồng bộ từ hệ thống API và cập nhật theo từng lần tải trang hoặc thay đổi bộ lọc.",
  },
];

export const pageSeoFaq: Record<string, PageSeoFaqEntry> = {
  "cho-thue": {
    seoContent:
      "<h2>Cho thuê bất động sản</h2><p>Tổng hợp tin cho thuê mới nhất theo khu vực, mức giá và diện tích để giúp bạn tìm nhanh mặt bằng phù hợp.</p>",
    faqTitle: "Câu hỏi thường gặp về cho thuê",
    faqDescription: "Một số thông tin nhanh khi tìm bất động sản cho thuê.",
    faqs: defaultFaqs,
  },
  "can-thue": {
    seoContent:
      "<h2>Nhu cầu cần thuê</h2><p>Danh sách nhu cầu thuê bất động sản được cập nhật liên tục để kết nối nhanh giữa bên thuê và bên cho thuê.</p>",
    faqTitle: "Câu hỏi thường gặp về cần thuê",
    faqDescription: "Các thông tin phổ biến khi theo dõi nhu cầu thuê.",
    faqs: defaultFaqs,
  },
  "du-an": {
    seoContent:
      "<h2>Dự án bất động sản</h2><p>Khám phá các dự án nổi bật với thông tin tổng quan, vị trí và tiến độ cập nhật.</p>",
    faqTitle: "Câu hỏi thường gặp về dự án",
    faqDescription: "Một số lưu ý khi tham khảo danh sách dự án.",
    faqs: defaultFaqs,
  },
};
