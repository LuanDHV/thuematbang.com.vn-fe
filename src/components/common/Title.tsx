interface TitleProps {
  title: string;
  description?: string;
}

export default function Title({ title, description }: TitleProps) {
  return (
    <div className="mx-auto mb-8 max-w-5xl text-center lg:mb-12">
      <h1 className="text-heading mb-4 text-3xl font-semibold tracking-[-0.03em] md:text-5xl">
        {title}
      </h1>
      <div className="bg-primary/70 mx-auto mb-8 h-px w-20 rounded-full" />
      {description ? (
        <p className="text-secondary mx-auto max-w-2xl text-base leading-8 md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
