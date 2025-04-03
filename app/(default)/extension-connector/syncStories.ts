"use client";
import { IFetchResultRooms, IUpworkStories, UnknownClients } from "@/app/types";
import { upworkHeaders } from "@/app/constants";
import { createUpworkRequestLog } from "@/app/(default)/extension-connector/actions/actionRequestsLog";
import { createStories } from "@/app/(default)/extension-connector/actions/actionUpworkStory";
import { saveUnknownNames } from "@/app/(default)/extension-connector/actions/saveUnknownNames";


export default async function syncStories(room: string, companyReference: string) {
    console.log("Sync func...");
    let cursor = "";
    let hasMoreStories = true;
    let amountOfStories = 0;
    let unknownClients: UnknownClients = {};


    // region Fetch stories func
    const fetchStories = async (templateUrl: string) => {
        return new Promise((resolve) => {
            window.parent.postMessage({ action: "fetch", templateUrl, headers: upworkHeaders }, "*");

            const listener = (event: IFetchResultRooms) => {
                console.log("Sync: event.data.type: ", event.data.type);
                if (event.origin !== "https://www.upwork.com") return;

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

    while (hasMoreStories) {
        let attempts = 2;
        let response: IUpworkStories = "error";
        let templateUrl = `https://www.upwork.com/api/v3/rooms/rooms/${room}` + "/stories/simplified?limit=20&callerOrgId=${companyReference}";
        if (cursor) templateUrl = `${templateUrl}&cursor=${cursor}`;

        // region Save request log to DB
        try {
            await createUpworkRequestLog(templateUrl);
        } catch (error) {
            console.error("Sync: Save log error", error);
        }
        // endregion Save request log to DB

        // region Fetch stories iteration on plugin
        while (attempts) {
            try {
                response = await fetchStories(templateUrl) as IUpworkStories;
                console.log("SR: response: ", response);
            } catch (error) {
                console.error("SR: get plugin response error: ", error);
            }

            if (response !== "error" || !attempts) break;
            console.log("SR: attempt: ", attempts);
            attempts -= 1;
        }

        if (response === "error") {
            console.error("Fetch error after 2 attempts");
            break;
        }
        const { stories } = response || {};
        console.log("SR: stories: ", stories?.length);
        // endregion Fetch stories iteration on plugin

        if (!stories?.length) break;

        // region Save Stories to DB
        try {
            const savedStories = await createStories(stories, unknownClients);
            if (savedStories === null) {
                console.error("SR: Failed to save room", savedStories);
                window.parent.postMessage({ action: "error", message: `❗Failed to save messages for room ${room}` }, "*");
                break;
            }

            unknownClients = { ...unknownClients, ...savedStories.unknownClients };

            if (!savedStories.next) break;

            cursor = response.cursor;
            console.log("SR: Stories saved:", savedStories);
        } catch (error) {
            console.error("SR: Save stories error", error);
            window.parent.postMessage({ action: "error", message: `❗Save stories for room ${room}` }, "*");
            break;
        }
        // endregion Save Stories to DB

        // region Pause 1s
        await new Promise(resolve => setTimeout(resolve, 1000));
        // endregion Pause 1s
    }

    console.log("Unknown clients: ", unknownClients);

    // region Handle Unknown clients
    const storyIds = Object.keys(unknownClients);

    for (let storyId of storyIds) {
        const clientData = unknownClients[storyId];
        let response: any = "error";

        for (let agent of clientData.agents) {
            let url = "\n" +
                `https://www.upwork.com/api/v3/connections/auth/contacts/orgUid/${companyReference}/personUid/${agent}?uidsToFilter=${clientData.userId}&callerOrgId=${companyReference}`;

            // region Save request log to DB
            try {
                await createUpworkRequestLog(url);
            } catch (error) {
                console.error("Sync: Save log error", error);
            }
            // endregion Save request log to DB

            try {
                // region Pause 1s
                await new Promise(resolve => setTimeout(resolve, 1000));
                // endregion Pause 1s

                response = await fetchStories(url) as any;
                console.log(agent, clientData.userId, "Name: response: ", response);

                if (response !== "error") break;
                if (response === "error") {
                    console.error("Fetch name error");
                }
            } catch (error) {
                console.error("SR: get plugin response error: ", error);
            }
        }

        if (response?.contacts?.length) {
            unknownClients[storyId].clientName = `${response.contacts[0].contactPerson.firstName} ${response.contacts[0].contactPerson.lastName} `;
        }
    }
    // endregion Handle Unknown clients

    console.log("==== unknownClients ==> ", unknownClients);
    // region Save unknown clients
    try {
        await saveUnknownNames(unknownClients);
    } catch (error) {
        console.error("", error);
    }
    // endregion Save unknown clients



    window.parent.postMessage({ action: "success", message: `Processing finished ${room}` }, "*");
    console.log("All stories have been processed.", amountOfStories);
}
