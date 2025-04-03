"use client";

import { useState } from "react";
import { Pagination } from "@/components/pagination";
import { BlogItem } from "./blog-item";

export const Screen = ({ posts }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;

    const totalPosts = posts.length;
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const handlePageChange = page => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="flex flex-col gap-[48px]">
            <div className="space-y-[32px]">
                {currentPosts.map((post, index) => (
                    <BlogItem key={post.id || index} post={post} />
                ))}

                {currentPosts.length === 0 && <p className="text-center text-[#636363] py-10">No blog posts found.</p>}
            </div>

            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
        </div>
    );
};
