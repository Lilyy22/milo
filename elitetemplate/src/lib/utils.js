import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const IsEmptyObject = (obj) => {
  return obj && Object.keys(obj).length === 0;
};
