type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}
