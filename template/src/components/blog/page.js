import { Heading } from "@/components/heading";
import { Screen } from "./screen";
import { getBlogPosts } from "@/services/blog-service";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Spinner } from "@/components/spinner";

// This component will trigger Suspense
const BlogPosts = async () => {
    const data = await getBlogPosts(1, 100).catch(error => {
        console.error("Failed to fetch blog posts:", error);
        return null;
    });

    if (!data) return notFound();
    return <Screen posts={data.posts} />;
};

export default function Blog() {
    return (
        <section className="flex flex-col md:gap-[40px] gap-[48px]">
            <Heading type="h2" className="md:text-start text-center">
                Blog
            </Heading>

            <Suspense
                fallback={
                    <div className="flex justify-center items-center h-[25vh]">
                        <Spinner />
                    </div>
                }>
                <BlogPosts />
            </Suspense>
        </section>
    );
}
