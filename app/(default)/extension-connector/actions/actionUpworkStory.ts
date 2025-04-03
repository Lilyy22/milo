"use server";
import { Room, Story, UnknownClients } from "@/app/types";
import { prisma } from "@/lib/prisma";
import { getOurUpworkUsers } from "@/app/(default)/extension-connector/actions/actionUpworkUser";
import { getOurUpworkOrgs } from "@/app/(default)/extension-connector/actions/actionUpworkOrg";
import moment from "moment-timezone";
import { sendStoriesToHubspot } from "@/app/(default)/extension-connector/actions/actionHubspot";

export async function createStories(stories: any[], unknownClients: UnknownClients) {
    try {
        const room = await prisma.upworkRooms.findUnique({ where: { roomId: stories[0].roomId } }) as Room | null;
        const { roomId } = room || {};
        if (!room || !roomId) return null;
        let next: boolean = true;
        const agents: string[] = [];

        // region Create story for DB and save
        for (const story of stories) {
            const { storyId } = story;

            const existingStory = await prisma.upworkStories.findUnique({ where: { storyId } });
            if (existingStory && room.roomCreated) next = false;

            const { author, direction } = await defineAuthor(room, story, unknownClients, agents) || {};
            console.log("====storyId, author, direction ==> ", storyId, author, direction);

            if (direction === "OUTGOING" && !agents.includes(story.userId)) {
                agents.push(story.userId);
            }

            const storyData = {
                created              : story.created,
                fullStoryObject      : JSON.parse(JSON.stringify(story)),
                markedAsAbusive      : story.markedAsAbusive,
                message              : story?.message || story?.header || "empty",
                messageId            : story.messageId || "0",
                modified             : story.modified,
                roomId,
                storyId,
                updated              : BigInt(story.updated),
                userId               : story.userId || "unknown",
                author,
                direction,
                userModifiedTimestamp: BigInt(story.userModifiedTimestamp)
            };

            await prisma.upworkStories.upsert({
                where : { storyId },
                update: storyData,
                create: storyData
            });
            console.log(`StoryId ${storyId} saved/updated`);
        }
        // endregion Create story for DB and save

        // region Get and update room data creation and TTR
        const allStories = await prisma.upworkStories.findMany({ where: { roomId }, orderBy: { created: "asc" } }) as Story[];

        // region Save messages to Hubspot
        await sendStoriesToHubspot(allStories, roomId);
        // endregion Save messages to Hubspot

        let sum: number = 0;
        let paarAmount = 0;
        console.log("==== room.roomId ==> ", room.roomId);
        for (let i = 0; i < allStories.length; i++) {
            if (paarAmount >= 5) break;

            const story = allStories[i];
            const nextStory = allStories[i + 1] || undefined;
            console.log("==== story.storyId ==> ", story.storyId);
            console.log("==== story.direction  ==> ", story.direction);
            console.log("==== !!(nextStory) ==> ", !!(nextStory));
            if (story.direction === "OUTGOING" || !nextStory || (story.direction === nextStory?.direction)) continue;

            const storyCreatedObj = moment.tz(Number(story.created), "America/New_York");
            console.log("==== storyCreatedObj ==> ", storyCreatedObj.format());
            // region cut off weekend
            const dayOfWeek = storyCreatedObj.day();
            console.log("==== dayOfWeek ==> ", dayOfWeek);
            const isWorkDay = dayOfWeek >= 1 && dayOfWeek <= 5;
            console.log("==== isWorkDay ==> ", isWorkDay);
            if (!isWorkDay) continue;
            // endregion cut off weekend

            // region cut off non-working time
            const workDayStart = storyCreatedObj.clone().hour(9).minute(0).second(0).millisecond(0);
            const workDayEnd = storyCreatedObj.clone().hour(17).minute(0).second(0).millisecond(0);
            const isWithinWorkHours = storyCreatedObj.isBetween(workDayStart, workDayEnd, null, "[]");
            console.log("==== workDayStart ==> ", workDayStart);
            console.log("==== workDayEnd ==> ", workDayEnd);
            console.log("==== isWithinWorkHours ==> ", isWithinWorkHours);
            if (!isWithinWorkHours) continue;
            // endregion cut off non-working time

            const delta = Number(nextStory.created) - Number(story.created);
            console.log("==== delta ==> ", delta);
            if (delta < 1000) continue;
            sum += delta;
            paarAmount += 1;
            console.log("sum, amount", sum, paarAmount);
        }

        const created = allStories[0].created;
        console.log("==== created ==> ", created);
        const TTR = paarAmount ? Math.floor(sum / paarAmount / 60000) : 0;
        console.log("==== TTR ==> ", TTR);

        await prisma.upworkRooms.update({ where: { roomId }, data: { roomCreated: created, TTR } });
        // endregion

        console.log("==7777== unknownClients ==> ", unknownClients);
        return { next, unknownClients };
    } catch (error: any) {
        console.error("Error save/update stories:", error);
        return null;
    }
}

async function defineAuthor(room: Room, story: any, unknownClients: UnknownClients, agents: string[]): Promise<{
    author: string, direction: "OUTGOING" | "INCOMING" | "UNKNOWN"
}> {
    const context = room.fullRoomObject.context;
    const ourUsers = await getOurUpworkUsers();
    const ourOrgs = await getOurUpworkOrgs();

    const author = ourUsers.find(user => user.id === story.userId);

    if (author || ourOrgs?.includes(story.orgId)) {
        return { author: author?.name || context?.associatedAgency || "Our Agent", direction: "OUTGOING" };
    }

    let clientName = context?.clientName || context?.associatedClientCompany;
    if (!clientName && story.userId) {
        if (!unknownClients[story.userId]) {
            unknownClients[story.storyId] = { userId: story.userId, clientName: "", agents };
        }
        console.log("==11== unknownClients ==> ", unknownClients);
    }

    return { author: clientName || "Unknown client", direction: "INCOMING" };
}
