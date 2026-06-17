interface TitleProps {
  title: string;
  description?: string;
  eyebrow?: string;
  align?: "center" | "left";
  level?: 1 | 2 | 3;
}

export default function Title({
  title,
  description,
  eyebrow,
  align = "center",
  level = 2,
}: TitleProps) {
  const isCentered = align === "center";
  const HeadingTag = `h${level}` as const;

  return (
    <div
      className={`mb-8 max-w-5xl ${isCentered ? "mx-auto text-center" : ""} lg:mb-12`}
    >
      {eyebrow ? (
        <p
          className={`text-primary mb-3 text-xs font-semibold tracking-[0.22em] uppercase ${isCentered ? "" : "text-left"}`}
        >
          {eyebrow}
        </p>
      ) : null}
      <HeadingTag
        className={`text-heading mb-4 text-3xl font-semibold tracking-[-0.03em] md:text-5xl ${isCentered ? "" : "max-w-3xl"}`}
      >
        {title}
      </HeadingTag>
      <div
        className={`bg-primary/70 mb-8 h-px w-20 rounded-full ${isCentered ? "mx-auto" : ""}`}
      />
      {description ? (
        <p
          className={`text-secondary max-w-2xl text-base leading-8 md:text-lg ${isCentered ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
