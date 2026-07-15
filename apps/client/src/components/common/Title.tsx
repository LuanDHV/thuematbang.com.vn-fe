interface TitleProps {
  title: string;
  description?: string;
  eyebrow?: string;
  level?: 1 | 2 | 3;
  variant?: "default" | "home";
}

export default function Title({
  title,
  description,
  eyebrow,
  level = 2,
  variant = "default",
}: TitleProps) {
  const HeadingTag = `h${level}` as const;
  const isHomeVariant = variant === "home";

  return (
    <div className="mx-auto max-w-5xl text-center">
      {eyebrow ? (
        <p className="text-primary mb-4 text-sm font-semibold tracking-[0.22em] uppercase">
          {eyebrow}
        </p>
      ) : null}
      <HeadingTag
        className={`text-heading ${isHomeVariant ? "text-2xl leading-tight font-semibold tracking-[-0.055em] normal-case md:text-4xl lg:text-5xl" : "text-2xl font-bold tracking-[-0.04em] uppercase lg:text-3xl"} ${description ? "mb-4" : ""}`}
      >
        {title}
      </HeadingTag>
      {description ? (
        <p
          className={`text-secondary mx-auto max-w-3xl ${isHomeVariant ? "text-base leading-7 lg:text-lg" : "text-sm leading-6 lg:text-base"}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
