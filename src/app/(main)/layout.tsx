import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import FloatingActions from "@/components/common/FloatingActions";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-app text-body flex min-h-dvh flex-col">
      <Header />
      <main className="grow pt-16">{children}</main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
