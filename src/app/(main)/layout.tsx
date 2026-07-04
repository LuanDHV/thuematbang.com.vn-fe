import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import FloatingActions from "@/components/common/FloatingActions";
import SubHeader from "@/components/common/SubHeader";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-app text-body flex min-h-dvh flex-col">
      <SubHeader />
      <Header />
      <main className="grow pt-28">{children}</main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
