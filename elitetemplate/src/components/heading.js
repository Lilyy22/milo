import { Playfair_Display } from "next/font/google";
import clsx from "clsx";

const playfairDisplay = Playfair_Display({
    subsets: ["latin"],
    weight: ["500", "600", "700", "800", "900"],
    display: "swap",
});

const headingClass = "leading-[120%] capitalize";


export const Heading = ({ type, children, className }) => {
    switch (type) {
        case "name":
            return <h1 className={clsx(playfairDisplay.className, headingClass, "text-gray lg:text-[120px] text-[36px] font-bold leading-[130%] tracking-[3px] uppercase leading-trim-both text-edge-cap [font-feature-settings:'liga'_off,'clig'_off]", className)}>{children}</h1>;
        case "h1":
            return <h1 className={clsx(playfairDisplay.className, headingClass, "lg:text-[56px] text-[36px] font-normal", className)}>{children}</h1>;
        case "h2":
            return <h2 className={clsx(playfairDisplay.className, headingClass, "lg:text-[32px] text-[24px] font-semibold", className)}>{children}</h2>;
        case "h3":
            return <h3 className={clsx(playfairDisplay.className, headingClass, "lg:text-[24px] text-[20px] font-semibold", className)}>{children}</h3>;
        case "h4":
            return <h4 className={clsx(playfairDisplay.className, headingClass, "lg:text-[20px] text-[16px] font-semibold", className)}>{children}</h4>;
    }
};
