import Image from "next/image";
import { Heading } from "@/components/heading";
import NewsMan from "@/public/news-man.png";
import { Items } from "./items";
import { BigItem } from "./big-item";
import { Item } from "./item";

const name = "James Rutherford";
const text = `In the fast-paced world of business, clear and well-structured legal agreements are essential for protecting both parties involved. A well-drafted contract outlines rights, responsibilities, and expectations, minimizing risks and preventing disputes.`;

export default function News() {
    const handlePageChange = (page) => {
        console.log(page);
    };
    return (
        <section className="flex flex-col md:gap-[40px] gap-[48px]">
            <Heading type="h2" className="md:text-start text-center">
                Blog
            </Heading>
            <div className="flex items-center relative min-h-[500px] h-full">
                {/* <Image src={NewsMan} alt="James Rutherford" fill objectFit="cover" objectPosition="center" /> */}
                <Image src={NewsMan} alt="James Rutherford" fill objectFit="cover" objectPosition="center" />
                <Heading type="name" className="absolute top-0 left-[48px]">
                    {name.split(" ")[0]}
                </Heading>
                <Heading type="name" className="absolute bottom-0 left-1/2 -translate-x-1/2">
                    {name.split(" ")[1]}
                </Heading>

                <div className="absolute z-50 lg:top-[100px] lg:right-[32px] top-[20px] right-[12px] flex items-end justify-center">
                    <p className="text-gray lg:text-[20px] text-[8px] font-normal leading-[130%] lg:max-w-[410px] max-w-[110px] text-center">
                        Leadership in healthcare demands a delicate balance between compassion, excellence, and innovation. <br />
                        Over the years, I've learned that the most effective leaders are those who serve their teams with humility and
                        grace.
                    </p>
                </div>
            </div>
            <div className="flex flex-col md:gap-[32px] gap-[24px]">
                <Heading type="h3" className="md:text-start text-center !text-[24px]">
                    Latest News
                </Heading>
                <div className="md:flex hidden">
                    <BigItem text={text} />
                </div>
                <div className="md:hidden mb-[80px]">
                    <Item text={text} />
                </div>
                <Items />
            </div>
        </section>
    );
}
