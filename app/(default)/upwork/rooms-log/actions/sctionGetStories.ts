"use server";
import { prisma } from "@/lib/prisma";

export async function getUpworkStories(roomId: string) {
    console.log("Get stories stats...", roomId);

    try {
        const stories = await prisma.upworkStories.findMany({ where: { roomId } });
        if (!stories) {
            console.log("Failed to get stories", stories);
            return null;
        }

        return stories.map((story) => {
            return {
                storyId  : story.storyId,
                created  : Number(story.created),
                message  : story.message,
                direction: story.direction,
                author   : story.author
            };
        });

    } catch (error: any) {
        console.error("GS: Get upwork stories error: ", error);
        return null;
    }
}
