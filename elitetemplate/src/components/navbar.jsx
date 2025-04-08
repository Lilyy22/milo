"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import MobileMenu from "./mobile-menu";
import { usePathname } from "next/navigation";
import { NAVIGATION_LINKS } from "@/constants";

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a1a33] text-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="text-lg font-bold uppercase tracking-wider">
          <Link href="/">DR. JONATHAN THOMSON</Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li>
              {NAVIGATION_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  tabIndex={0}
                  className="uppercase hover:border-b-2 hover:border-blue-200 hover:pb-1"
                >
                  {link.label}
                </Link>
              ))}
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && <MobileMenu onClose={toggleMobileMenu} />}
    </header>
  );
}
