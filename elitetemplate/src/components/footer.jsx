import { Nav } from "./nav";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[#0a1a33] py-8 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="text-lg font-bold border-r pr-12">
            DR. JONATHAN THOMSON
          </div>

          {/* <SOCIAL_LINKS /> */}

          {/* Desktop Navigation */}
          <Nav />
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          {`Copyright © ${currentYear} • Dr. Jonathan Thomson • All Rights Reserved`}
        </div>
      </div>
    </footer>
  );
}
