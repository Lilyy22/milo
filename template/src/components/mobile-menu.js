"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Logo } from "./logo";
import BurgerIcon from "@/public/burger-icon.svg";
import CloseIcon from "@/public/close-icon.svg";
import { Nav } from "./nav";
import { SOCIAL_LINKS } from "./social-links";

export const MobileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const currentYear = new Date().getFullYear();

    const handleToggle = () => setIsOpen(!isOpen);

    const handleKeyDown = e => {
        if (e.key === "Enter" || e.key === " ") handleToggle();
    };

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";
        return () => (document.body.style.overflow = "unset");
    }, [isOpen]);

    return (
        <div className="md:hidden">
            <button
                className="z-50 flex items-center justify-center absolute right-0 top-0"
                onClick={handleToggle}
                onKeyDown={handleKeyDown}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                tabIndex={0}>
                <Image src={isOpen ? CloseIcon : BurgerIcon} alt="Menu" width={44} height={44} priority />
            </button>

            <div
                className={clsx(
                    "fixed inset-0 z-40 bg-white flex flex-col items-center justify-between p-4",
                    "transition-all duration-300 ease-in-out",
                    isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none",
                )}>
                <div className="w-full flex flex-col items-center justify-center gap-[48px]">
                    <div className="self-start">
                        <Logo />
                    </div>
                    <Nav className="flex flex-col items-center" />
                </div>

                <div className="w-full flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center gap-12 mt-8">
                        <SOCIAL_LINKS />
                    </div>

                    <div className="mt-6">
                        <Logo />
                    </div>

                    <hr className="my-[40px] w-full" />

                    <p className="text-sm text-gray text-center">
                        Copyright © {currentYear} • James Rutherford
                        <br />• All Rights Reserved
                    </p>
                </div>
            </div>
        </div>
    );
};
