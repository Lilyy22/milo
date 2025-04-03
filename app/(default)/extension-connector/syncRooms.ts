"use client";
import { IFetchResultRooms, IUpworkResponse } from "@/app/types";
import { upworkHeaders } from "@/app/constants";
import syncStories from "@/app/(default)/extension-connector/syncStories";
import { createUpworkRequestLog } from "@/app/(default)/extension-connector/actions/actionRequestsLog";
import { createUpworkRooms } from "@/app/(default)/extension-connector/actions/actionUpworkRoom";
import { sendRoomsToHubspot } from "@/app/(default)/extension-connector/actions/actionHubspot";

export default async function syncRooms(companyReference: string) {
    console.log("Room Sync func...");
    const allowedOrigins = ["https://tracker.pragmaticdlt.com", "https://www.upwork.com", "http://localhost:3000",
        "https://webapp-pragmatic-portal.azurewebsites.net"];
    let cursor = "";
    let hasMoreRooms = true;
    let roomsForSync: string[] = [];
    let roomsForHubspotSave: string[] = [];

    // region Fetch rooms func
    const fetchRooms = async (templateUrl: string): Promise<IUpworkResponse> => {
        return new Promise((resolve) => {
            window.parent.postMessage({ action: "fetch", templateUrl, headers: upworkHeaders }, "*");

            const listener = (event: IFetchResultRooms) => {
                console.log("Sync: event.data.type: ", event.data.type);
                if (!allowedOrigins.some(origin => event.origin.startsWith(origin))) {
                    console.error("Sync: Bad origin", event.origin);
                    return null;
                }

                const { type, response } = event.data;

                if (type === "fetch result") {
                    window.removeEventListener("message", listener);
                    resolve(response);
                }
            };

            window.addEventListener("message", listener);
        });
    };
    // endregion

    while (hasMoreRooms) {
        let attempts = 2;
        let templateUrl = `https://www.upwork.com/api/v3/rooms/rooms/simplified?limit=20&callerOrgId=${companyReference}`;
        if (cursor) templateUrl = `${templateUrl}&cursor=${cursor}`;
        let response: IUpworkResponse = "error";

        // region Save request log to DB
        try {
            await createUpworkRequestLog(templateUrl);
        } catch (error) {
            console.error("Sync: Save log error", error);
        }
        // endregion

        // region Fetch Rooms
        while (attempts) {
            try {
                response = await fetchRooms(templateUrl);
                console.log("Sync: room fetch response: ", response);
            } catch (error) {
                console.error("Sync: get plugin response error: ", error);
            }

            if (response !== "error" || !attempts) break;
            console.log("Sync: attempt: ", attempts);
            attempts -= 1;
        }


        if (response === "error") {
            console.error("Fetch error after 2 attempts");
            window.parent.postMessage({
                action: "error", message: "❗Fetch error after 2 attempts. Failed to fetch data. Stop" +
                    " handling."
            }, "*");
            break;
        }
        const { rooms } = response;
        // endregion

        // region Save rooms to DB
        if (rooms?.length) {
            try {
                const result = await createUpworkRooms(rooms, companyReference);
                const { roomsForSync: forSync, roomsForHubspotSave: forHubspot, next } = result || {};
                if (!forSync || !forHubspot) {
                    window.parent.postMessage({ action: "error", message: "❗Failed to save data. Handle next butch." }, "*");
                    console.error("Failed to save room");
                }
                else {
                    roomsForSync.push(...forSync);
                    roomsForHubspotSave.push(...forHubspot);
                    console.log("Rooms saved: ", forSync);
                }
                hasMoreRooms = Boolean(next);
            } catch (error) {
                console.error("Save rooms error", error);
                window.parent.postMessage({ action: "error", message: "❗Error while saving data. Handle next butch." }, "*");
            }

            cursor = response.cursor || "";
        }
        else {
            hasMoreRooms = false;
        }
        // endregion

        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // region Send rooms to Hubspot
    console.log("==== HUBSPOT ==> ");
    console.log("==== roomsForHubspotSave ==> ", roomsForHubspotSave);
    for (const room of roomsForHubspotSave) {
        console.log("HUBSPOT sync room: ", room);
        await sendRoomsToHubspot(room);
    }
    // endregion

    window.parent.postMessage({ action: "notification", message: `✅ Rooms list fetched. There is ${roomsForSync.length} rooms to sync...` },
        "*");

    // region Sync stories
    console.log("\n\n\nRooms for sync: ", roomsForSync);
    if (!roomsForSync?.length) {
        console.log("No rooms needs to be updated");
        return;
    }

    for (const room of roomsForSync) {
        window.parent.postMessage({ action: "notification", message: `🔄 Sync room: ${room}` }, "*");
        await syncStories(room, companyReference);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    //endregion


    console.log("Synchronization procedure finished.");
}
