export const getBlogPosts = async (page = 1, pageSize = 6) => {
    try {
        // In a real application, this would be an API call like:
        // const response = await fetch(`/api/blog?page=${page}&pageSize=${pageSize}`)
        // const data = await response.json()
        // return data

        // For now, we'll simulate an API response with mock data
        const mockPosts = Array(20)
            .fill(null)
            .map((_, index) => ({
                id: `post-${index + 1}`,
                date: `January ${10 + (index % 20)}, 2025`,
                title: `The Importance Of A Client-Centered Approach In Legal Services ${index + 1}`,
                content: `In today's fast-paced world, legal matters can often feel overwhelming and complex. Whether handling business disputes, real estate transactions, or personal injury claims, the right legal team can make all the difference. A client-centered approach in legal services ensures that individuals and businesses receive tailo...`,
            }));

        // Calculate pagination
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedPosts = mockPosts.slice(startIndex, endIndex);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            posts: paginatedPosts,
            total: mockPosts.length,
        };
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        throw error;
    }
};

export const getBlogPostById = async id => {
    try {
        // In a real application, this would be an API call like:
        // const response = await fetch(`/api/blog/${id}`)
        // const data = await response.json()
        // return data

        // For now, we'll simulate an API response
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            id,
            date: "January 15, 2025",
            title: `The Importance Of A Client-Centered Approach In Legal Services`,
            content: `In today's fast-paced world, legal matters can often feel overwhelming and complex. Whether handling business disputes, real estate transactions, or personal injury claims, the right legal team can make all the difference. A client-centered approach in legal services ensures that individuals and businesses receive tailored solutions that address their specific needs.

This approach recognizes that each client comes with unique circumstances, goals, and concerns. By prioritizing these individual factors, legal professionals can develop strategies that align perfectly with their clients' objectives. This personalized attention not only leads to more effective outcomes but also builds trust and confidence throughout the legal process.

When clients feel heard and understood, they become active participants in their legal journey. This collaboration between attorney and client creates a powerful dynamic that often leads to more innovative solutions and satisfactory resolutions.`,
            author: "Jane Doe",
            category: "Legal Advice",
        };
    } catch (error) {
        console.error("Error fetching blog post:", error);
        throw error;
    }
};
