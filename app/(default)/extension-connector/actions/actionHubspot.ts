"use server";
import { prisma } from "@/lib/prisma";
import process from "process";
import { getOurUpworkUsers } from "@/app/(default)/extension-connector/actions/actionUpworkUser";
import { Story } from "@/app/types";
import moment from "moment-timezone";

export async function sendRoomsToHubspot(room: string) {

    // region Get zapier creds
    const zapierUrl = process.env.ZAPIER_URL;
    if (!zapierUrl) {
        console.error("Failed to get zapier url");
        return;
    }
    // endregion Get zapier creds

    try {
        // region Get Room data
        const roomData = await prisma.upworkRooms.findUnique({
            where  : { roomId: room },
            include: {
                stories: {
                    orderBy: {
                        created: "asc"
                    },
                    select : {
                        message  : true,
                        direction: true,
                        author   : true
                    }
                }
            }
        });
        if (!roomData) {
            console.error("Failed to find room");
            return;
        }

        console.log("==== roomData ==> ", roomData);
        // endregion Get Room data

        // region Create object for zapier
        const source = roomData.stories?.some(
            str => str.message?.includes("Slavik Chernenko joined the room") || str.message?.includes("**Michael Popchuk** added **Slavik"));
        const ourUsers = await getOurUpworkUsers();

        const description = roomData.stories?.find(
            story => story?.author && ourUsers?.some(user => user?.name === story?.author)
        )?.author || "";


        const hubspotObject = {
            dealname       : roomData.roomName,
            pipeline       : "default",
            dealstage      : 22841964,
            dealtype       : "newbusiness",
            upwork_room    : `https://www.upwork.com/ab/messages/rooms/${room}`,
            request_summary:  Array.isArray(roomData.stories) && roomData.stories.length > 0 ? roomData.stories[0].message : "message",
            source         : source ? "upwrk-mike-out" : "upwrk-slavik-in",
            description
        };
        // endregion Create object for zapier

        return await sendObjToZapier(hubspotObject, zapierUrl) || null;
    } catch (error) {
        console.error("Send data to Hubspot error: ", error);
    }
}


export async function sendStoriesToHubspot(allStories: Story[], roomId: string) {
    // region Get Zapier creds
    const zapierUrl = process.env.ZAPIER_MESSAGE_WEBHOOK;
    if (!zapierUrl) {
        console.error("Failed to get zapier url");
        return;
    }
    // endregion Get Zapier creds

    // region Get dealId
    let dealId: string | null = null;
    try {
        const room = await prisma.upworkRooms.findUnique({ where: { roomId } });
        dealId = room?.hubspotDealId || null;
        if (!dealId) return;
    } catch (error) {
        console.error("Get room info for hubspot deal error: ", error);
        return;
    }
    // endregion Get dealId

    // region Create string
    const emailString = allStories.sort((a, b) => Number(a.created) - Number(b.created)).map((story, index) => {
        const storyCreated = moment.tz(Number(story.created), "America/New_York").format("yyyy-MM-DD HH:mm");
        const author = story.author || "";
        const message = story.message || "";

        // Добавляем отступы для старых сообщений
        const indent = "&nbsp;".repeat(index * 4);

        let start = "";
        let end = "";
        for (let i = 0; i < index; i += 1) {
            start = start + `<div style="margin-left: 2px; border-left: 1px solid #ccc; padding-left: 5px;">`;
            end = end + "</div>";
        }

        return `${start}${indent}<div>
                    <p><strong>${storyCreated}:</strong></p>
                    <p><strong>${author}:</strong> </p>
                    <p>${message}</p>
                </div>${end}`;
    }).join("\n");
    // endregion Create string

    // region Send data to zapier
    try {
        return await sendObjToZapier({ dealId, message: emailString }, zapierUrl) || null;
    } catch (error) {
        console.error("Send data to Hubspot error: ", error);
        return null;
    }
    // endregion Send data to zapier
}


async function sendObjToZapier(hubspotObject: any, zapierUrl: string) {
    console.log("Hubspot Object: ", hubspotObject);

    const sentDealData = await fetch(zapierUrl,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(hubspotObject) });
    console.log("Sent Deal Data: ", sentDealData);
    const sentDeal = await sentDealData.json();
    console.log("Sent Deal Res", sentDeal);
    if (!sentDealData.ok) {
        console.error("Failed to send data to zapier", sentDeal);
        return null;
    }

    return sentDeal;
}
