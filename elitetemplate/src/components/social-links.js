"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Linkedin,
  X,
  FacebookIcon,
  LucideFacebook,
} from "lucide-react";

// const getSocialIcon = (id) => {
//   switch (id) {
//     case "linkedin":
//       return Linkedin;
//     case "facebook":
//       return Facebook;
//     case "twitter":
//       return Twitter;
//     case "x":
//       return XIcon;
//     default:
//       return XIcon;
//   }
// };

export const SOCIAL_LINKS = ({ className }) => {
  return (
    <div className="flex space-x-4">
      <Link href="#" aria-label="Twitter">
        <X className="w-5 h-5" />
      </Link>
      <Link href="#" aria-label="Facebook">
        <Facebook className="w-5 h-5" />
      </Link>
      <Link href="#" aria-label="LinkedIn">
        <Linkedin className="w-5 h-5" />
      </Link>
    </div>
  );
};
