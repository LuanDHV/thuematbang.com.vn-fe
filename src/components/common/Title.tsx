interface TitleProps {
  title: string;
  description?: string;
  eyebrow?: string;
  level?: 1 | 2 | 3;
}

export default function Title({
  title,
  description,
  eyebrow,
  level = 2,
}: TitleProps) {
  const HeadingTag = `h${level}` as const;

  return (
    <div className="mx-auto max-w-5xl text-center">
      {eyebrow ? (
        <p className="text-primary mb-4 text-sm font-semibold tracking-[0.22em] uppercase">
          {eyebrow}
        </p>
      ) : null}
      <HeadingTag
        className={`text-heading text-2xl font-bold tracking-[-0.04em] uppercase lg:text-3xl ${description ? "mb-4" : ""}`}
      >
        {title}
      </HeadingTag>
      {description ? (
        <p className="text-secondary mx-auto max-w-3xl text-sm leading-6 lg:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
