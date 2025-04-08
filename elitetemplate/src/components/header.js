"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Nav } from "./nav";
import { Logo } from "./logo";

export const Header = ({ clientName }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a1a33] text-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />
        {/* Desktop Navigation */}
        <Nav />

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a1a2f] border-t border-gray-700 mt-4">
          <div className="container mx-auto px-4 py-3">
            <Nav />
          </div>
        </div>
      )}
    </header>
  );
};
