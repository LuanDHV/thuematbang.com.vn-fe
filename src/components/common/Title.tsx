interface TitleProps {
  title: string;
  description?: string;
}

export default function Title({ title, description }: TitleProps) {
  return (
    <div className="mx-auto mb-12 max-w-5xl text-center">
      <h1 className="mb-4 text-3xl font-semibold tracking-[-0.03em] text-heading md:text-5xl">
        {title}
      </h1>
      <div className="mx-auto mb-8 h-px w-20 rounded-full bg-primary/70" />
      {description ? (
        <p className="mx-auto max-w-2xl text-base leading-8 text-secondary md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}

