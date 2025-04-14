import { Nav } from "./nav";
import { SOCIAL_LINKS } from "./social-links";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[#0a1a33] py-8 text-white">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="pr-12 text-lg font-bold border-r">
            DR. JONATHAN THOMSON
          </div>

          <SOCIAL_LINKS />

          {/* Desktop Navigation */}
          <Nav />
        </div>

        <div className="mt-8 text-xs text-center text-gray-400">
          {`Copyright © ${currentYear} • Dr. Jonathan Thomson • All Rights Reserved`}
        </div>
      </div>
    </footer>
  );
}
