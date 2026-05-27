import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-app text-body">
      <Header />
      <main className="grow pt-16">{children}</main>
      <Footer />
    </div>
  );
}
