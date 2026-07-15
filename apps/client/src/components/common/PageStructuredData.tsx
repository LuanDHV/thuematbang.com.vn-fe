import JsonLd from "@/components/common/JsonLd";

type PageStructuredDataProps = {
  schemas: Array<Record<string, unknown>>;
};

export default function PageStructuredData({
  schemas,
}: PageStructuredDataProps) {
  if (!schemas.length) return null;

  return <JsonLd data={schemas} />;
}
