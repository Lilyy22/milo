import { MainBlock } from "./main-block";
import { InfoBlock } from "./info-block";
import { KeysBlock } from "./keys-block";
import { Heading } from "@/components/heading";
import { HOME_PAGE_CONTENT } from "@/constants";

export default function Home() {
    const { title, mainBlock, keysBlock, footer } = HOME_PAGE_CONTENT;

    return (
        <section className="w-full flex flex-col md:gap-[156px] gap-[80px]">
            <MainBlock title={title} />
            <InfoBlock block={mainBlock} />
            <KeysBlock block={keysBlock} />
            <div className="max-w-[856px] w-full mx-auto">
                <Heading type="h2" className="md:text-start text-center">
                    {footer}
                </Heading>
            </div>
        </section>
    );
}
