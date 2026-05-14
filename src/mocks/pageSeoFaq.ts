type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

type PageSeoFaqConfig = {
  seoContent: string;
  faqTitle: string;
  faqDescription: string;
  faqs: FaqItem[];
};

export const pageSeoFaq: Record<"cho-thue" | "can-thue" | "du-an", PageSeoFaqConfig> = {
  "cho-thue": {
    seoContent: `
      <h2>Cho thuê mặt bằng nhanh, đúng nhu cầu</h2>
      <p>Danh mục cho thuê tập trung vào mặt bằng kinh doanh, văn phòng và kho xưởng với thông tin rõ ràng về vị trí, diện tích và mức giá.</p>
      <p>Người thuê có thể lọc theo khu vực, khoảng giá và diện tích để rút ngắn thời gian tìm kiếm, đồng thời so sánh nhiều lựa chọn trên cùng một giao diện.</p>
    `,
    faqTitle: "Câu hỏi thường gặp về cho thuê",
    faqDescription: "Giải đáp các thắc mắc phổ biến khi đăng tin và tìm mặt bằng cho thuê.",
    faqs: [
      {
        id: "cho-thue-1",
        question: "Làm sao để đăng tin cho thuê mặt bằng?",
        answer:
          "Bạn tạo tài khoản, vào trang đăng tin và điền thông tin vị trí, diện tích, giá thuê, hình ảnh thực tế.",
      },
      {
        id: "cho-thue-2",
        question: "Tin cho thuê hiển thị trong bao lâu?",
        answer:
          "Thời gian hiển thị phụ thuộc gói bạn chọn. Bạn có thể gia hạn hoặc nâng cấp khi cần tăng tiếp cận.",
      },
      {
        id: "cho-thue-3",
        question: "Có thể chỉnh sửa tin sau khi đăng không?",
        answer:
          "Có. Bạn có thể cập nhật giá, mô tả, ảnh và trạng thái tin bất cứ lúc nào trong phần quản lý tin.",
      },
    ],
  },
  "can-thue": {
    seoContent: `
      <h2>Cần thuê mặt bằng theo tiêu chí cụ thể</h2>
      <p>Danh mục cần thuê dành cho cá nhân và doanh nghiệp đang tìm mặt bằng phù hợp theo ngân sách, loại hình và khu vực hoạt động.</p>
      <p>Người cho thuê có thể theo dõi nhu cầu thực tế từ thị trường để kết nối nhanh hơn với khách có nhu cầu thật.</p>
    `,
    faqTitle: "Câu hỏi thường gặp về cần thuê",
    faqDescription: "Thông tin quan trọng trước khi đăng nhu cầu cần thuê mặt bằng.",
    faqs: [
      {
        id: "can-thue-1",
        question: "Đăng nhu cầu cần thuê có mất phí không?",
        answer:
          "Tùy chính sách từng thời điểm, hệ thống có thể có gói miễn phí và gói ưu tiên hiển thị.",
      },
      {
        id: "can-thue-2",
        question: "Nên ghi gì để chủ nhà liên hệ nhanh?",
        answer:
          "Bạn nên nêu rõ khu vực ưu tiên, loại mặt bằng, diện tích mong muốn, mức giá và thời điểm cần thuê.",
      },
      {
        id: "can-thue-3",
        question: "Có thể nhận nhiều đề xuất cùng lúc không?",
        answer:
          "Có. Khi nhu cầu rõ ràng, bạn sẽ nhận được nhiều liên hệ phù hợp để so sánh và lựa chọn.",
      },
    ],
  },
  "du-an": {
    seoContent: `
      <h2>Tổng hợp dự án bất động sản nổi bật</h2>
      <p>Trang dự án cập nhật các dự án mới theo khu vực, pháp lý và tiến độ triển khai để người dùng dễ theo dõi.</p>
      <p>Thông tin được trình bày theo nhóm danh mục giúp lọc nhanh các dự án phù hợp mục tiêu đầu tư hoặc khai thác kinh doanh.</p>
    `,
    faqTitle: "Câu hỏi thường gặp về dự án",
    faqDescription: "Những điểm cần quan tâm khi theo dõi và đánh giá thông tin dự án.",
    faqs: [
      {
        id: "du-an-1",
        question: "Thông tin dự án có cập nhật thường xuyên không?",
        answer:
          "Có. Dữ liệu được bổ sung định kỳ để phản ánh thông tin mới về tiến độ và danh mục dự án.",
      },
      {
        id: "du-an-2",
        question: "Làm sao lọc dự án theo danh mục?",
        answer:
          "Bạn chọn danh mục trên trang dự án, hệ thống sẽ cập nhật danh sách tương ứng theo slug danh mục.",
      },
      {
        id: "du-an-3",
        question: "Có thể xem chi tiết từng dự án không?",
        answer:
          "Có. Mỗi dự án có trang chi tiết riêng với thông tin mô tả, hình ảnh và nội dung liên quan.",
      },
    ],
  },
};

