"use client";

import clsx from "clsx";
import { SOCIAL_LINKS as SOCIAL_LINKS_CONSTANTS } from "@/constants";
import XIcon from "@/public/x-icon.svg";
import Image from "next/image";
import { Facebook, Twitter, Linkedin } from "lucide-react";

const getSocialIcon = (id) => {
  switch (id) {
    case "linkedin":
      return Linkedin;
    case "facebook":
      return Facebook;
    case "twitter":
      return Twitter;
    case "x":
      return XIcon;
    default:
      return XIcon;
  }
};

export const SOCIAL_LINKS = ({ className }) => {
  return (
    <div className="flex space-x-4">
      {SOCIAL_LINKS_CONSTANTS.map((social) => (
        <Link href="#" aria-label="Twitter">
          <Twitter className="h-5 w-5" />
        </Link>
      ))}
    </div>
  );
};
