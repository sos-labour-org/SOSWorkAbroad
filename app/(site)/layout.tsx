import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { VisitorTracker } from "@/components/VisitorTracker";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <VisitorTracker />
      <Header />
      {children}
      <Footer />
    </>
  );
}