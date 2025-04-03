import { Playfair_Display } from "next/font/google";
import clsx from "clsx";

const playfairDisplay = Playfair_Display({
    subsets: ["latin"],
    weight: ["600"],
    display: "swap",
    variable: "--font-playfair-display",
});

export const Logo = () => {
    return (
        <div className="inline-flex items-center justify-center border-2 border-black py-1 px-4">
            <h3
                className={clsx(playfairDisplay.className, "text-xl font-semibold tracking-[3px] uppercase leading-[130%]")}
                style={{ fontFeatureSettings: "'liga' off, 'clig' off" }}>
                James Rutherford
            </h3>
        </div>
    );
};
