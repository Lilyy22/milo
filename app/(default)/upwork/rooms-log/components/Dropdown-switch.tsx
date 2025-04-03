"use client";

import { useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useNotification } from "@/app/notifications-context";
import { StagesSet } from "@/app/types";
import { updateRoomStage } from "@/app/(default)/upwork/rooms-log/actions/updateRoomStage";

const options: { id: number, channel: StagesSet }[] = [
    {
        id     : 0,
        channel: "-"
    },
    {
        id     : 1,
        channel: "Request"
    },
    {
        id     : 2,
        channel: "Active chat"
    },
    {
        id     : 3,
        channel: "Call accepted"
    },
    {
        id     : 4,
        channel: "Requirements gathered"
    },
    {
        id     : 5,
        channel: "Proposal sent"
    },
    {
        id     : 6,
        channel: "Waiting for response"
    },
    {
        id     : 7,
        channel: "Closed won"
    },
    {
        id     : 8,
        channel: "Closed lost"
    }
];

export default function DropdownSwitch({ currentStage, roomId }: { currentStage: StagesSet | "unknown" | null, roomId: string }) {
    const { addNotification } = useNotification();
    const [selected, setSelected] = useState<number>(options.find(el => el.channel === currentStage)?.id || 0);

    const handleOnClick = async (id: number) => {
        setSelected(id);
        try {
            const selectedStage = options.find(el => el.id === id)?.channel;
            if (!selectedStage) {
                console.error("");
                addNotification("Error occurred while defining the stage. Please try again.", "error");
                return;
            }

            const updatedRoom = await updateRoomStage(roomId, selectedStage);
            if (!updatedRoom.ok) {
                console.error(updatedRoom.message);
                addNotification(updatedRoom.message, "error");
                return;
            }
            addNotification(updatedRoom.message, "success");
        } catch (error) {
            console.error("Save stage error: ", error);
            addNotification("Error occurred while update the stage. Please try again.", "error");
        }
    };


    return (
        <>
            <Menu as="div" className="relative">
                <Menu.Button className="grow flex items-center truncate">
                    <div className="truncate">
                        <span
                            className="text-sm font-medium dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-slate-200">{options[selected].channel}</span>
                    </div>
                    <svg className="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400" viewBox="0 0 12 12">
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"/>
                    </svg>
                </Menu.Button>
                <Transition
                    className="origin-top-right z-10 absolute top-full left-0 min-w-[15rem] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1"
                    enter="transition ease-out duration-200 transform" enterFrom="opacity-0 -translate-y-2" enterTo="opacity-100 translate-y-0"
                    leave="transition ease-out duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Menu.Items as="ul" className="focus:outline-none">
                        {options.map((option, optionIndex) => (
                            <Menu.Item key={optionIndex} as="li">
                                {({ active }) => (
                                    <button className={`w-full font-medium text-sm block py-1.5 px-3 ${active ? "text-slate-800 dark:text-slate-200"
                                        : "text-slate-600 dark:text-slate-300"}`} onClick={() => handleOnClick(option.id)}>
                                        <div className="flex items-center justify-between">
                                            <div className="grow flex items-center truncate">
                                                <div className="truncate">{option.channel}</div>
                                            </div>
                                            <svg className={`w-3 h-3 shrink-0 fill-current text-indigo-500 ml-1 ${option.id !== selected &&
                                            "invisible"}`} viewBox="0 0 12 12">
                                                <path
                                                    d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z"/>
                                            </svg>
                                        </div>
                                    </button>
                                )}
                            </Menu.Item>
                        ))}
                    </Menu.Items>
                </Transition>
            </Menu>
        </>
    );
}
