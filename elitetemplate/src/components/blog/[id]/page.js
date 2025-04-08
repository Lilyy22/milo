import { Heading } from "@/components/heading";
import { getBlogPostById } from "@/services/blog-service";
import Link from "next/link";
import { SOCIAL_LINKS } from "@/components/social-links";
import { Suspense } from "react";
import { Spinner } from "@/components/spinner";

const BlogPostContent = async ({ id }) => {
    const post = await getBlogPostById(id);

    return (
        <div className="md:space-y-[32px] space-y-[48px]">
            <article className="bg-gray/10 md:p-[40px] p-[24px_16px] flex flex-col items-center justify-center">
                <div className="max-w-[856px] w-full">
                    <p className="text-gray text-[15px] font-normal leading-[140%] mb-[12px]">{post.date}</p>

                    <Heading type="h3" className="md:text-start text-center md:mb-[16px] mb-[24px]">
                        {post.title}
                    </Heading>

                    <div className="text-[17px] font-normal leading-[140%]">
                        <p>
                            In today's fast-paced world, legal matters can often feel overwhelming and complex. Whether handling business
                            disputes, real estate transactions, or personal injury claims, the right legal team can make all the difference.
                            A client-centered approach in legal services ensures that individuals and businesses receive tailored guidance,
                            transparent communication, and dedicated advocacy.
                        </p>
                        <br />
                        <p>Personalized Legal Solutions</p>
                        <br />
                        <p>
                            Each client's situation is unique, and a one-size-fits-all strategy rarely leads to the best outcome. A firm
                            that prioritizes personalized legal solutions takes the time to understand clients' specific needs and concerns.
                            This allows for customized strategies that align with their objectives, ensuring efficient and effective
                            resolution of legal matters.
                        </p>
                        <br />
                        <p>Clear and Transparent Communication</p>
                        <br />
                        <p>
                            Legal jargon can be intimidating, leaving clients uncertain about their cases. A client-focused law firm ensures
                            clear, straightforward communication throughout the legal process. By breaking down complex legal terms into
                            understandable language and keeping clients informed about every step, law firms build trust and confidence.
                        </p>
                        <br />
                        <p>Strategic Advocacy with a Results-Driven Mindset</p>
                        <br />
                        <p>
                            An experienced legal team doesn't just offer advice—it advocates for clients with determination and strategic
                            precision. Whether in negotiations or the courtroom, lawyers who are dedicated to their clients' success work
                            relentlessly to achieve favorable outcomes. With in-depth legal knowledge and an unwavering commitment to
                            justice, they provide the representation clients need.
                        </p>
                    </div>
                </div>

                <div className="md:mt-[32px] mt-[24px] lg:pr-[110px] w-full flex md:justify-end justify-start">
                    <div className="flex flex-col gap-[8px]">
                        <div className="text-[#101010] font-medium">Share this post:</div>
                        <SOCIAL_LINKS />
                    </div>
                </div>
            </article>
            <div className="max-w-[966px] w-full mx-auto">
                <p className="text-[17px] font-normal leading-[140%] md:mb-[32px] mb-[24px]">Recent posts</p>
                <div className="grid md:grid-cols-2 grid-cols-1 md:gap-[32px] gap-[24px]">
                    <div className="space-y-[12px]">
                        <Heading type="h4" className="!leading-[130%]">
                            The Art of Servant Leadership in Healthcare
                        </Heading>
                        <p className="text-gray text-[15px] font-normal leading-[140%]">January 10,2025</p>
                    </div>
                    <div className="space-y-[12px]">
                        <Heading type="h4" className="!leading-[130%]">
                            The Art of Servant Leadership in Healthcare
                        </Heading>
                        <p className="text-gray text-[15px] font-normal leading-[140%]">January 10,2025</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function BlogPost({ params }) {
    const { id } = params;

    return (
        <section className="flex flex-col">
            <Heading type="h2" className="md:text-start text-center">
                Blog
            </Heading>

            <div className="md:mt-[24px] mt-[16px] mb-[24px] lg:pl-[110px]">
                <Link href="/blog" prefetch className="inline-flex items-center" aria-label="Back to all posts" tabIndex={0}>
                    <div className="flex items-center justify-center h-[44px] w-[44px]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 12 24" fill="none">
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M3.34299 12L10.414 19.071L8.99999 20.485L1.22199 12.707C1.03451 12.5195 0.929199 12.2652 0.929199 12C0.929199 11.7348 1.03451 11.4805 1.22199 11.293L8.99999 3.515L10.414 4.929L3.34299 12Z"
                                fill="#636363"
                            />
                        </svg>
                    </div>
                    All posts
                </Link>
            </div>

            <Suspense
                fallback={
                    <div className="flex justify-center items-center h-[25vh]">
                        <Spinner />
                    </div>
                }>
                <BlogPostContent id={id} />
            </Suspense>
        </section>
    );
}
