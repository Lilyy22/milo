"use server";

import { IRoomWithCount, IUpworkRoomItem, UpworkStatPeriod } from "@/app/types";
import { prisma } from "@/lib/prisma";
import { getOurUpworkUsers } from "@/app/(default)/extension-connector/actions/actionUpworkUser";
import { getOurUpworkOrgs } from "@/app/(default)/extension-connector/actions/actionUpworkOrg";
import moment from "moment-timezone";

export async function getUpworkRooms(period: UpworkStatPeriod): Promise<IUpworkRoomItem[] | null> {
    console.log("Get rooms stats...");

    const startDate = periodToDate(period);

    try {
        const roomsRes = await prisma.upworkRooms.findMany({
            where  : startDate ? { recentTimestamp: { gt: startDate } } : undefined,
            include: {
                stories: {
                    select : {
                        userId   : true,
                        created  : true,
                        author   : true,
                        direction: true,
                        storyId  : true
                    },
                    orderBy: {
                        created: "desc"
                    }
                }
            },
            orderBy: {
                recentTimestamp: "desc"
            }
        }) as any as IRoomWithCount[];

        if (!roomsRes) {
            console.error("GR: Failed to get rooms", roomsRes);
            return null;
        }
        console.log("GR: raw rooms from DB: ", roomsRes?.length);

        const filteredRooms = roomsRes.filter(room => room.stories?.length > 2);
        console.log("==== filteredRooms ==> ", filteredRooms?.length);

        const filteredRoomsWithTTR = await checkTTR((filteredRooms));

        const rooms = await getStatData(filteredRoomsWithTTR) as IUpworkRoomItem[];
        console.log("GR: rooms to return: ", rooms?.length);
        console.log("==== first room ==> ", rooms?.length && rooms[0]);
        return rooms;
    } catch (error: any) {
        console.error("GS: Get upwork stat error: ", error);
        return null;
    }
}

async function checkTTR(rooms: IRoomWithCount[]) {
    const checkedRooms: IRoomWithCount[] = [];

    for (const room of rooms) {
        console.log("==== *********** ==> ");
        console.log("==== room.roomName ==> ", room.roomName);
        if (room.TTR !== 888888) { // 888888 - flag for DB to recalculate TTR
            checkedRooms.push(room);
            continue;
        }

        const stories = room.stories.sort((a, b) => Number(a.created) - Number(b.created));
        let paarAmount = 0;
        let sum = 0;
        console.log("==== stories ==> ", stories);

        for (let i = 0; i < stories.length; i++) {
            if (paarAmount >= 5) break;

            const story = stories[i];
            const nextStory = stories[i + 1] || undefined;

            // region cut off Outgoing, no Next story, the same direction
            if (story.direction === "OUTGOING" || !nextStory || (story.direction === nextStory?.direction)) continue;
            // endregion cut off Outgoing, no Next story, the same direction

            const storyCreatedObj = moment.tz(Number(story.created), "America/New_York");

            const storyCreated = storyCreatedObj.format("yyyy-MM-DD HH:mm:ss Z");
            console.log("==== storyCreated ==> ", storyCreated);

            // region cut off weekend
            const dayOfWeek = storyCreatedObj.day();
            const isWorkDay = dayOfWeek >= 1 && dayOfWeek <= 5;
            if (!isWorkDay) {continue;}
            // endregion cut off weekend

            // region cut off non-working time
            const workDayStart = storyCreatedObj.clone().hour(9).minute(0).second(0).millisecond(0);
            const workDayEnd = storyCreatedObj.clone().hour(17).minute(0).second(0).millisecond(0);
            console.log("==== workDayStart ==> ", workDayStart.format());
            console.log("==== workDayEnd.format() ==> ", workDayEnd.format());
            const isWithinWorkHours = storyCreatedObj.isBetween(workDayStart, workDayEnd, null, "[]");
            console.log("==== isWithinWorkHours ==> ", isWithinWorkHours);

            if (!isWithinWorkHours) {continue;}
            // endregion cut off non-working time

            const delta = Number(nextStory.created) - Number(story.created);
            if (delta < 1000) continue;

            console.log("==== delta/60000 ==> ", delta / 60000);
            sum += delta;
            paarAmount += 1;
            console.log("sum, amount", sum, paarAmount);
        }

        const TTR = paarAmount ? Math.floor(Number(sum) / paarAmount / 60000) : 0;
        console.log("==== TTR ==> ", TTR);

        await prisma.upworkRooms.update({ where: { roomId: room.roomId }, data: { TTR } });

        room.TTR = TTR;
        checkedRooms.push(room);
    }
    return checkedRooms;
}


// region periodToDate
const periodToDate = (period: UpworkStatPeriod): number => {
    const now = new Date();
    let startDate: Date | null;

    switch (period) {
        case "day":
            startDate = new Date(now.setDate(now.getDate() - 1));
            break;
        case "week":
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
        case "month":
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
        case "year":
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
        case "all":
            startDate = null;
            break;
        default:
            console.error("Error in period", period);
            startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    return startDate ? startDate.getTime() : 0;
};
// endregion

// region Get Stat Data
const getStatData = async (roomsRes: IRoomWithCount[]): Promise<IUpworkRoomItem[]> => {
    const ourUsers = await getOurUpworkUsers();
    const ourOrgs = await getOurUpworkOrgs();

    return roomsRes.map((room: IRoomWithCount) => {
        const client = room.stories.find(story => story.direction === "INCOMING" && story.author !== "Unknown client")?.author || "Client";
        const agent = room.stories.find(story => story.direction === "OUTGOING")?.author || "Agent";

        const lastStoryId = room?.fullRoomObject?.latestStory?.storyId;
        const lastStory = lastStoryId ? room?.stories.find(story => story.storyId === lastStoryId) : room?.stories[0];

        const ourUser = ourUsers?.find(user => user?.id === lastStory?.userId);
        const ourOrg = ourOrgs?.map(org => org?.id).includes(lastStory?.orgId || "undefined");

        const authorsSet = new Set(room.stories.map(story => story.author)
            .filter(author => author && ourUsers.map(user => user.name).includes(author)));

        const authors = Array.from(authorsSet).filter(author => author !== null && author !== undefined) as string[];

        const lastMessageAuthor = ourUser || ourOrg ? agent || "Agent" : client;

        const roomCreated = moment.tz(Number(room?.roomCreated), "America/New_York").format("MM/DD/yyyy hh:mm a");

        return {
            TTR            : room?.TTR,
            agent,
            client,
            authors,
            lastMessageAuthor,
            lastStoryDate  : room.fullRoomObject?.latestStory?.created,
            roomCreated,
            roomId         : room?.roomId,
            roomName       : room?.roomName,
            totalMessages  : room?.stories?.length || 0,
            clientMessages : room?.stories?.filter(story => story.direction === "INCOMING")?.length,
            recentTimestamp: room?.recentTimestamp,
            stage          : room.stage
        };
    });
};
// endregion Get Stat Data
