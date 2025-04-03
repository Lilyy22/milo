"use server";
import { prisma } from "@/lib/prisma";
import { getOurUpworkUsers, saveOurAgent } from "@/app/(default)/extension-connector/actions/actionUpworkUser";

export async function createUpworkRooms(rooms: any[], companyReference: string) {
    console.log(rooms.length, "\n************************************\nUpwork room save...");
    const roomsForSync: string[] = [];
    const roomsForHubspotSave: string[] = [];

    try {
        for (const room of rooms) {
            const { roomId } = room;
            console.log("\n=== roomId === ", roomId);
            const existingRoom = await prisma.upworkRooms.findUnique({ where: { roomId } });
            console.log("Room exists ?", Boolean(existingRoom));

            if (!existingRoom) {
                roomsForHubspotSave.push(roomId);
            } else {
                const lastRoomStory = await prisma.upworkStories.findFirst({ where: { roomId }, orderBy: { created: "desc" } });
                console.log("lastStory created, room recentTimestamp", lastRoomStory?.created, room.recentTimestamp);

                const isSynced = Boolean(lastRoomStory && existingRoom.roomCreated && (lastRoomStory?.created === BigInt(room.recentTimestamp)));
                console.log("Is room synced: ", isSynced);
                if (isSynced) continue;
            }

            roomsForSync.push(roomId);

            // region Save Room
            const roomData = {
                roomId         : room.roomId,
                roomName       : room.roomName,
                roomType       : room.roomType,
                topic          : room.topic,
                recentTimestamp: BigInt(room.recentTimestamp),
                fullRoomObject : room as any
            };

            await prisma.upworkRooms.upsert({
                where : { roomId: room.roomId },
                update: roomData,
                create: roomData
            });
            console.log(`RoomId ${room.roomId} saved/updated\n\n`);
            // endregion

            // region Save our user
            const ourUsers = await getOurUpworkUsers();
            // console.log("==== ourUsers ==> ", ourUsers.length);
            // console.log("==== room.roomType ==> ", room.roomType);
            // console.log("==== room.context?.freelancerOrgId ==> ", room.context?.freelancerOrgId);
            // console.log("==== companyReference ==> ", companyReference);
            // console.log("==== ourUsers.map(user => user.id).includes(room.context?.freelancerId) ==> ",
            //     ourUsers.map(user => user.id).includes(room.context?.freelancerId));
            // console.log("==== condition ==> ", room.roomType === 3 && room.context?.freelancerOrgId === companyReference &&
            //     !ourUsers.map(user => user.id).includes(room.context?.freelancerId));
            if (room.roomType === 3 && room.context?.associatedAgencyOrgId === companyReference &&
                !ourUsers.map(user => user.id).includes(room.context?.freelancerId)) {
                await saveOurAgent(room.context, companyReference);
            }
            // endregion
        }

        return { roomsForSync, roomsForHubspotSave, next: rooms.length === roomsForSync.length };
    } catch (error: any) {
        console.error("Error save/update room:", error);
        return null;
    }
}
