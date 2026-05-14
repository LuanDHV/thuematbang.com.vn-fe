interface TitleProps {
  title: string;
  description?: string;
}

export default function Title({ title, description }: TitleProps) {
  return (
    <div className="mx-auto mb-12 max-w-5xl text-center">
      {/* Title */}
      <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 uppercase md:text-4xl">
        {title}
      </h1>

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
