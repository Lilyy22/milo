"use client";

import { NAVIGATION_LINKS } from "@/constants";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

export const Nav = ({ className }) => {
    const pathname = usePathname();
    const isActive = path => pathname === path;

    return (
        <nav className={clsx("gap-[16px] px-[16px] text-base font-normal leading-[130%]", className)}>
            {NAVIGATION_LINKS.map(link => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={clsx("p-[8px_4px_4px_4px]", isActive(link.href) && "font-semibold border-b-2 border-gray")}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    tabIndex={0}>
                    {link.label}
                </Link>
            ))}
        </nav>
    );
};
