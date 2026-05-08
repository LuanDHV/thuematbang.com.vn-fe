// 1. Định nghĩa kiểu dữ liệu cho Props (Nếu dùng TypeScript)
interface TitleProps {
  title: string;
  description?: string; // Dấu ? để không bắt buộc phải có description
}

export default function Title({ title, description }: TitleProps) {
  return (
    <div className="mx-auto mb-16 max-w-4xl text-center">
      {/* Title */}
      <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 uppercase md:text-4xl">
        {title}
      </h2>

      {/* Decorative Line - Căn giữa */}
      <div className="bg-primary mx-auto mb-8 h-1.5 w-16 rounded-full"></div>

      {/* Description */}
      {description && (
        <p className="mx-auto max-w-2xl text-lg leading-relaxed font-light text-gray-500 md:text-xl">
          {description}
        </p>
      )}
    </div>
  );
}
