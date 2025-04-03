"use client";

import clsx from "clsx";
import { SOCIAL_LINKS as SOCIAL_LINKS_CONSTANTS } from "@/constants";
import LinkedInIcon from "@/public/linkedin-icon.svg";
import FacebookIcon from "@/public/facebook-icon.svg";
import XIcon from "@/public/x-icon.svg";
import Image from "next/image";

const getSocialIcon = id => {
    switch (id) {
        case "linkedin":
            return LinkedInIcon;
        case "facebook":
            return FacebookIcon;
        case "x":
            return XIcon;
        default:
            return XIcon;
    }
};

export const SOCIAL_LINKS = ({ className }) => {
    return (
        <div className={clsx("flex items-center gap-6 justify-start", className)}>
            {SOCIAL_LINKS_CONSTANTS.map(social => (
                <a href={social.url} target="_blank" rel="noopener noreferrer" key={social.url} aria-label={social.alt} tabIndex="0">
                    <Image src={getSocialIcon(social.id)} alt={social.alt} width={44} height={44} />
                </a>
            ))}
        </div>
    );
};
