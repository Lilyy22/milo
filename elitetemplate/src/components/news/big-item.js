"use client";

import Image from "next/image";
import NewsImage from "@/public/news-test.png";
import { useState } from "react";
import { Heading } from "@/components/heading";

export const BigItem = ({ text }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const truncatedText = text.substring(0, 150) + "...";
    const handleToggleExpand = () => setIsExpanded(prev => !prev);

    return (
        <div className="grid grid-cols-2 gap-[12px] mb-8 bg-gray/10">
            <div className="p-[24px] h-full flex flex-col justify-center">
                <Heading type="h4">The Importance of Clear Legal Agreements in Business</Heading>
                <p className="text-gray text-[15px] font-normal leading-[140%] my-3">January 15, 2025</p>
                <p className="text-[#101010]">{isExpanded ? text : truncatedText}</p>
                <button
                    onClick={handleToggleExpand}
                    className="px-[32px] py-2 text-[17px] font-medium leading-[140%] capitalize w-fit self-end mt-[24px]"
                    tabIndex="0"
                    aria-label={isExpanded ? "Read less" : "Read more"}
                    onKeyDown={e => e.key === "Enter" && handleToggleExpand()}>
                    {isExpanded ? "Read Less" : "Read More"}
                </button>
            </div>
            <Image src={NewsImage} alt="Legal document with fountain pen" className="object-cover" />
        </div>
    );
};
