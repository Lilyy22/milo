"use client";

import ModalRoom from "@/app/(default)/upwork/rooms-log/components/ModalRoom";
import { IUpworkRoomItem } from "@/app/types";
import { useEffect, useState } from "react";
import { getUpworkStories } from "@/app/(default)/upwork/rooms-log/actions/sctionGetStories";
import { useNotification } from "@/app/notifications-context";
import Link from "next/link";
import moment from "moment-timezone";

export default function DrawerRoom({ room, setRoomModalOpen }: { room: IUpworkRoomItem, setRoomModalOpen: Function }) {
    const [stories, setStories] = useState<any[]>([]);
    const { addNotification } = useNotification();

    useEffect(() => {
        (async () => {
            try {
                const stories = await getUpworkStories(room.roomId);
                if (!stories) {
                    console.error("Failed to fetch stories", stories);
                    addNotification("Failed to get stories for the selected room. Please try again.", "error");
                    return;
                }

                console.log("==== storiesData ==> ", stories);
                setStories(stories.sort((a, b) => b.created - a.created));
            } catch (error) {
                console.error("Fetch stories error", error);
            }
        })(); // eslint-disable-next-line
    }, []);


    return (
        <div>
            <div className="flex flex-wrap items-center -m-1.5">

                <div className="m-1.5">
                    <ModalRoom isOpen={Boolean(room)} setIsOpen={setRoomModalOpen as any} title={`Room ${room.roomName}`}>
                        <div className="px-5 pt-4 pb-1">
                            <div className="text-sm">
                                <button
                                    className="btn bg-white mb-2 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-indigo-500">
                                    <Link href={`https://www.upwork.com/ab/messages/rooms/${room.roomId}?sidebar=true`} target="_blank"
                                          rel="noopener noreferrer">
                                        Go to the room
                                    </Link>
                                </button>
                                <ul className="space-y-2 mb-4">

                                    {stories &&
                                        stories.map((story) => {
                                            const storyCreatedObj = moment.tz(story.created, "America/New_York");
                                            const storyCreated = storyCreatedObj.format("yyyy-MM-DD HH:mm");

                                            // region cut off weekend
                                            const dayOfWeek = storyCreatedObj.day();
                                            const isWorkDay = dayOfWeek >= 1 && dayOfWeek <= 5;
                                            // endregion cut off weekend

                                            // region cut off non-working time
                                            const workDayStart = storyCreatedObj.clone().hour(9).minute(0).second(0).millisecond(0);
                                            const workDayEnd = storyCreatedObj.clone().hour(17).minute(0).second(0).millisecond(0);

                                            // region cut off non-working time
                                            const isWithinWorkHours = storyCreatedObj.isBetween(workDayStart, workDayEnd, null, '[]');
                                            console.log("==== isWithinWorkHours ==> ", isWithinWorkHours);
                                            console.log("==== isWorkDay ==> ", isWorkDay);
                                            // endregion cut off non-working time

                                            const isWorkTime = isWithinWorkHours && isWorkDay;

                                            return (
                                                <li key={story.storyId}>
                                                    <div
                                                        className={`flex flex-col grow justify-between mb-0.5 w-full h-full py-3 px-4 rounded shadow-sm ${story.direction ===
                                                        "INCOMING" ? "items-start" : "items-end bg-slate-200 dark:bg-slate-900/40"}`}>
                                                        <p className="font-medium text-slate-800 dark:text-slate-100">{story.author}</p>
                                                        <p className="text-xs italic text-slate-500 align-top">
                                                            {storyCreated} {!isWorkTime && story.direction === "INCOMING" ? " 🔕" : " "}
                                                        </p>
                                                        <div className="text-sm">{story.message}</div>
                                                    </div>
                                                </li>
                                            );
                                        })
                                    }

                                </ul>
                            </div>
                        </div>

                    </ModalRoom>

                </div>

            </div>
        </div>
    );
}
