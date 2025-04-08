"use client";

import { Heading } from "@/components/heading";
import Image from "next/image";
import { useState } from "react";
import NewsImage from "@/public/news-test.png";

export const Item = ({ text }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const truncatedText = text.substring(0, 150) + "...";

    const handleToggleExpand = () => setIsExpanded(prev => !prev);

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-fit">
                <Image src={NewsImage} width={416} height={200} alt="Legal document with fountain pen" className="w-full h-auto" />
                <div className="p-4 flex flex-col bg-gray/10 w-full">
                    <Heading type="h4">The Importance of Clear Legal Agreements in Business</Heading>
                    <p className="text-gray text-[15px] font-normal leading-[140%] my-3">January 15, 2025</p>
                    <p className="text-[17px] font-normal leading-[140%]">{isExpanded ? text : truncatedText}</p>
                    <button
                        onClick={handleToggleExpand}
                        className="px-[32px] py-2 text-[17px] font-medium leading-[140%] capitalize w-fit self-end mt-[24px]"
                        tabIndex="0"
                        aria-label={isExpanded ? "Read less" : "Read more"}
                        onKeyDown={e => e.key === "Enter" && handleToggleExpand()}>
                        {isExpanded ? "Read Less" : "Read More"}
                    </button>
                </div>
            </div>
        </div>
    );
};
