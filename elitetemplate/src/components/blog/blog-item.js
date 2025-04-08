import Link from "next/link";
import { Heading } from "@/components/heading";

export const BlogItem = ({ post }) => {
    return (
        <article>
            <div className="space-y-3">
                <p className="text-gray text-[15px] font-normal leading-[140%]">{post.date}</p>
                <Heading type="h3" className="md:text-start text-center">{post.title}</Heading>
                <p className="text-[#636363] leading-relaxed">{post.content}</p>
            </div>
            <div className="text-right mt-[32px]">
                <Link
                    href={`/blog/${post.id}`}
                    className="px-[32px] py-2 text-[17px] font-medium leading-[140%] capitalize inline-block"
                    aria-label={`Read more about ${post.title}`}>
                    Read More
                </Link>
            </div>
        </article>
    );
};
