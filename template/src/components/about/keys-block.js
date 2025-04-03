import { Heading } from "@/components/heading";

const ItemBlock = ({ title, text }) => {
    return (
        <div className="border-l-2 border-gray pl-[16px] py-[8px] text-[17px] font-normal leading-[140%] flex flex-col gap-[12px] md:justify-start justify-center">
            <Heading type="h3">{title}</Heading>
            <p className="text-[17px] font-normal leading-[140%]">{text}</p>
        </div>
    );
};

export const KeysBlock = ({ block }) => {
    const { title, items, footer } = block;

    return (
        <div className="bg-gray/10 md:py-[48px] py-[24px] md:px-[24px] px-[16px]">
            <div className="max-w-[856px] mx-auto md:space-y-[48px] space-y-[24px]">
                <Heading type="h2">{title}</Heading>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
                    {items.map((value, index) => (
                        <ItemBlock key={index} title={value.name} text={value.description} />
                    ))}
                </div>

                <p className="text-[17px] font-normal leading-[140%]">{footer}</p>
            </div>
        </div>
    );
};
