import Title from "@/components/common/Title";
import { ShieldCheck, Users, ListCheck, LockKeyhole } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck className="text-primary h-8 w-8" />,
    title: "Uy Tín Hàng Đầu",
    description: "Được tin tưởng bởi hàng nghìn khách hàng trên toàn quốc.",
  },
  {
    icon: <Users className="text-primary h-8 w-8" />,
    title: "Đội Ngũ Chuyên Nghiệp",
    description: "Đội ngũ tư vấn giàu kinh nghiệm, luôn sẵn sàng hỗ trợ 24/7.",
  },
  {
    icon: <ListCheck className="text-primary h-8 w-8" />,
    title: "Danh Mục Đa Dạng",
    description:
      "Hơn 10,000+ bất động sản chất lượng cao được cập nhật liên tục.",
  },
  {
    icon: <LockKeyhole className="text-primary h-8 w-8" />,
    title: "Bảo Mật Thông Tin",
    description: "Cam kết bảo vệ thông tin và quyền lợi tối đa cho khách hàng.",
  },
];

export default function IntroduceSection() {
  return (
    <section className="to-primary/5 relative w-full overflow-hidden bg-linear-to-b from-white py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Title
          title="Giới thiệu"
          description="Chúng tôi là nền tảng kết nối hàng đầu trong lĩnh vực bất động sản,
          mang đến giải pháp tối ưu cho mọi nhu cầu thuê và cho thuê. Với hệ
          thống danh mục đa dạng và dịch vụ chuyên nghiệp, chúng tôi cam kết tạo
          ra trải nghiệm tốt nhất cho khách hàng."
        />
        {/* Grid các đặc điểm nổi bật */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group hover:shadow-primary/20 relative flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-all duration-500 ease-in-out hover:-translate-y-2 hover:cursor-pointer hover:shadow-xl"
            >
              {/* Icon Container */}
              <div className="bg-primary/5 group-hover:bg-primary/10 mb-6 rounded-full p-4 transition-colors duration-300">
                {feature.icon}
              </div>

              <h3 className="mb-4 text-xl font-bold tracking-tight text-gray-900">
                {feature.title}
              </h3>

              <p className="text-sm leading-relaxed font-light text-gray-500">
                {feature.description}
              </p>

              {/* Decor Line (tùy chọn) */}
              <div className="bg-primary absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-b-2xl transition-all duration-500 group-hover:w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
