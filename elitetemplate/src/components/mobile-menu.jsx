"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { NAVIGATION_LINKS } from "@/constants";
import { usePathname } from "next/navigation";

export default function MobileMenu({ onClose }) {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  return (
    <div className="absolute right-0 z-40 top-16 md:hidden">
      <div className="relative w-64 bg-[#FEFEFE] shadow-lg rounded-bl-md overflow-hidden text-black">
        <div className="flex justify-center p-2">
          <button
            onClick={onClose}
            className="p-1 text-white"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
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
      </div>
    </div>
  );
}
