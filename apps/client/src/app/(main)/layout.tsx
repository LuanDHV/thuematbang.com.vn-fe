import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import SubHeader from "@/components/common/SubHeader";
import DeferredMainChrome from "@/components/common/DeferredMainChrome";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-app text-body flex min-h-dvh flex-col">
      <SubHeader />
      <Header />
      <main className="grow pb-24 pt-28 md:pb-0">{children}</main>
      <Footer />
      <DeferredMainChrome />
    </div>
  );
}
