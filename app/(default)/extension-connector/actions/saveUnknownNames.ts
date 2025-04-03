"use server";
import { UnknownClients } from "@/app/types";
import { prisma } from "@/lib/prisma";

export async function saveUnknownNames(unknownClients: UnknownClients) {
    console.log("Change name for unknownClients: ", unknownClients);

    try {
        const storyIds = Object.keys(unknownClients);

        for (let storyId of storyIds) {
            const clientData = unknownClients[storyId];

            const updatedStory = await prisma.upworkStories.update(
                { where: { storyId: storyId }, data: { author: clientData.clientName || "Unknown" } });
            console.log("Updated result: ", updatedStory);
        }
    } catch (error: any) {
        console.error("Error save/update stories:", error);
        return null;
    }
}
