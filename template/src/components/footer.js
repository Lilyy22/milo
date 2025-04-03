// "use client";

import { Logo } from "./logo";
import { SOCIAL_LINKS } from "./social-links";
import { Nav } from "./nav";

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="container mx-auto flex flex-col md:mt-[156px] mt-[80px]">
            <div className="grid lg:grid-cols-3 grid-cols-1 gap-[24px] w-full items-center lg:justify-items-stretch justify-items-center">
                <SOCIAL_LINKS />

                <div className="flex items-center justify-center">
                    <Logo />
                </div>

                <div className="lg:flex hidden">
                    <Nav className="flex items-center justify-end !gap-5 !text-[15px] !leading-[140%] !px-0" />
                </div>
            </div>

            <hr className="w-full mb-[40px] lg:mt-[40px] mt-[24px]" />

            <div className="text-gray text-[15px] font-normal leading-[140%] lg:text-start text-center">
                {`Copyright © ${currentYear} • James Rutherford • All Rights Reserved`}
            </div>
        </footer>
    );
};
