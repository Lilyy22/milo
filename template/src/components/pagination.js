"use client";

import clsx from "clsx";

const PrevButton = ({ currentPage, handlePageChange }) => {
    return (
        <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={clsx(
                "flex items-center justify-center w-[44px] h-[44px] text-black disabled:opacity-50 disabled:cursor-not-allowed",
                currentPage === 1 && "opacity-50 cursor-not-allowed text-gray",
            )}
            aria-label="Previous page"
            tabIndex={0}>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 12 24" fill="none">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.34299 12L10.414 19.071L8.99999 20.485L1.22199 12.707C1.03451 12.5195 0.929199 12.2652 0.929199 12C0.929199 11.7348 1.03451 11.4805 1.22199 11.293L8.99999 3.51501L10.414 4.92901L3.34299 12Z"
                    fill="#636363"
                />
            </svg>
        </button>
    );
};

export const NextButton = ({ currentPage, handlePageChange, totalPages }) => {
    return (
        <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={clsx(
                "flex items-center justify-center w-[44px] h-[44px] text-black disabled:opacity-50 disabled:cursor-not-allowed",
                currentPage === totalPages && "opacity-50 cursor-not-allowed text-gray",
            )}
            aria-label="Next page"
            tabIndex={0}>
            <span className="sr-only">Next page</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
    );
};

const PaginationButton = ({ currentPage, page, handlePageChange }) => {
    return (
        <button
            onClick={() => (page !== "..." ? handlePageChange(page) : null)}
            className={clsx(
                "flex items-center justify-center w-[44px] h-[44px] text-[17px] font-medium leading-[140%]",
                currentPage === page && "border-b-2 border-black",
                page === "..." && "cursor-default",
            )}
            aria-label={page !== "..." ? `Page ${page}` : "More pages"}
            aria-current={currentPage === page ? "page" : undefined}
            tabIndex={page !== "..." ? 0 : -1}>
            {page}
        </button>
    );
};
export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    // Calculate range of pages to show
    const getPageNumbers = () => {
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // Always show first page, last page, current page, and pages around current
        let pages = [1];

        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        // Add ellipsis before middle pages if needed
        if (startPage > 2) {
            pages.push("...");
        }

        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Add ellipsis after middle pages if needed
        if (endPage < totalPages - 1) {
            pages.push("...");
        }

        // Add last page if not already included
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        onPageChange(page);
    };

    return (
        <div className="flex justify-center">
            <div className="flex">
                <PrevButton currentPage={currentPage} handlePageChange={handlePageChange} />

                {getPageNumbers().map((page, index) => (
                    <PaginationButton key={`page-${index}`} currentPage={currentPage} page={page} handlePageChange={handlePageChange} />
                ))}

                <NextButton currentPage={currentPage} handlePageChange={handlePageChange} totalPages={totalPages} />
            </div>
        </div>
    );
};
