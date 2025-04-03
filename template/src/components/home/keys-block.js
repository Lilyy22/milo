import { Heading } from "@/components/heading";

const ItemBlock = ({ children }) => {
    return <div className="border-l-2 border-gray pl-[16px] py-[8px] text-[17px] font-normal leading-[140%]">{children}</div>;
};

export const KeysBlock = ({ block }) => {
    const { title, items, footer } = block;

    return (
        <div className="bg-gray/10 md:py-[48px] py-[24px] md:px-[24px] px-[16px]">
            <div className="max-w-[856px] mx-auto md:space-y-[48px] space-y-[24px]">
                <Heading type="h2">{title}</Heading>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
                    {items.map((value, index) => (
                        <ItemBlock key={index}>{value}</ItemBlock>
                    ))}
                </div>

                <p className="text-[17px] font-normal leading-[140%]">{footer}</p>
            </div>
        </div>
    );
};
