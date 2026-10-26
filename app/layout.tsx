import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SOS Work Abroad | Transfer to Transform",
  description:
    "Free recruitment for Africans seeking jobs abroad. Register today for UAE and European opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
        <html lang="en" className={poppins.variable} data-scroll-behavior="smooth">
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}