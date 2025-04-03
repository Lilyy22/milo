import Image from "next/image";
import AboutBg from "@/public/about-bg.png";
import { Heading } from "@/components/heading";

export const MainBlock = ({ title }) => {
    return (
        <div>
            <div className="grid md:grid-cols-[auto_minmax(300px,1fr)] grid-cols-1 items-center">
                <Image src={AboutBg} alt="Professional portrait" objectPosition="center" width={746} height={592} priority />
                <div className="bg-gray/10 h-full w-full flex items-center justify-center">
                    <div className="md:py-[159px] py-[48px] text-center md:px-[24px] px-[12px]">
                        <Heading type="h1">{title}</Heading>
                    </div>
                </div>
            </div>
        </div>
    );
};
