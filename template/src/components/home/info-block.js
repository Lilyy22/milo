import { Heading } from "@/components/heading";

export const InfoBlock = ({ block }) => {
    const { title, text } = block;
    return (
        <div className="max-w-[856px] mx-auto md:space-y-[48px] space-y-[16px]">
            <Heading type="h2" className="md:text-start text-center">
                {title}
            </Heading>
            <div className="text-[17px] font-normal leading-[140%] space-y-2">
                {text.split("\n").map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </div>
        </div>
    );
};
