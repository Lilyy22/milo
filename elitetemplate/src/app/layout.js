import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

// {
//   content;
// }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
      {googleAnalytics}
    </html>
  );
}
