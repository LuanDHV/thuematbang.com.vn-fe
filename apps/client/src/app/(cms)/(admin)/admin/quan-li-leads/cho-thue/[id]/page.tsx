import AdminLeadDetailSection from "@/components/cms/admin/AdminLeadDetailSection";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function LeadDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <AdminLeadDetailSection leadId={Number(id)} source="PROPERTY" />;
}
