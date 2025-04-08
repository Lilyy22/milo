import { Playfair_Display } from "next/font/google";
import Link from "next/link";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
  variable: "--font-playfair-display",
});

export const Logo = ({ clientName }) => {
  return (
    <div className="text-lg font-bold">
      <Link href="/">{clientName}</Link>
    </div>
  );
};
