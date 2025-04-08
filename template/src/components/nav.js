"use client";

import { NAVIGATION_LINKS } from "@/constants";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

export const Nav = ({ className }) => {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  return (
    <nav
      className={clsx(
        "gap-[16px] px-[16px] text-base font-normal leading-[130%]",
        className
      )}
    >
      {NAVIGATION_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={isActive(link.href) ? "page" : undefined}
          tabIndex={0}
          className={clsx(
            "p-[8px_4px_4px_4px]",
            isActive(link.href) && "font-semibold border-b-2 border-gray"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
    // <nav className="hidden md:flex space-x-6">
    //     <Link href="#" className="hover:text-blue-300 uppercase text-sm">
    //       Home
    //     </Link>
    //     <Link href="#" className="hover:text-blue-300 uppercase text-sm">
    //       About
    //     </Link>
    //     <Link href="#" className="hover:text-blue-300 uppercase text-sm">
    //       Blog
    //     </Link>
    //     <Link href="#" className="hover:text-blue-300 uppercase text-sm">
    //       In The News
    //     </Link>
    //     <Link href="#" className="hover:text-blue-300 uppercase text-sm">
    //       Contact
    //     </Link>
    //   </nav>
  );
};
