"use client";
import { useEffect, useRef } from "react";
import { createUpworkOrg } from "@/app/(default)/extension-connector/actions/actionUpworkOrg";
import syncRooms from "@/app/(default)/extension-connector/syncRooms";


export default function Home() {
    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current) {
            return;
        }
        try {
            const handleMessage = async (event: MessageEvent) => {
                const { type, companyReference } = event.data;
                console.log("Message type: ", type);

                switch (type) {
                    case "iframe created":
                        if (!companyReference) break;
                        await createUpworkOrg(companyReference);
                        window.parent.postMessage({ action: "server ok" }, "*");
                        break;

                    case "start sync":
                        window.parent.postMessage({ action: "sync started" }, "*");
                        await syncRooms(companyReference);
                        window.parent.postMessage({ action: "sync finished" }, "*");
                        break;
                }
            };

            if (typeof window !== "undefined") {
                window.addEventListener("message", handleMessage);
            }

            return () => {
                window.removeEventListener("message", handleMessage);
            };
        } catch (error) {
            console.error("Error handling message", error);
        }// eslint-disable-next-line
    }, []);

    return <div></div>;
}
