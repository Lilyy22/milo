import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import clsx from "clsx";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// {
//   content;
// }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={clsx(
          geistSans.variable,
          geistMono.variable,
          "antialiased",
          "lg:py-[40px] py-[16px] lg:px-[72px] px-[16px]"
        )}
      >
        <Header />
        <main className="container mx-auto">{children}</main>
        <Footer />
      </body>
      {googleAnalytics}
    </html>
  );
}
