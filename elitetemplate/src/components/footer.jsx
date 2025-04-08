import Link from "next/link";
import { NAVIGATION_LINKS, SOCIAL_LINKS } from "@/constants";

export default function Footer() {
  return (
    <footer className="bg-[#0a1a33] py-8 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="text-lg font-bold">DR. JONATHAN THOMSON</div>

          {/* <SOCIAL_LINKS /> */}

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                {NAVIGATION_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    // aria-current={isActive(link.href) ? "page" : undefined}
                    tabIndex={0}
                    className="uppercase hover:border-b-2 hover:border-blue-200 hover:pb-1"
                  >
                    Home
                  </Link>
                ))}
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          Copyright © 2025 • Dr. Jonathan Thomson • All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
