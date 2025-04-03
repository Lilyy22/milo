"use server"
import { prisma } from "@/lib/prisma";
import { StagesSet } from "@/app/types";

export async function updateRoomStage(roomId: string, stage: StagesSet) {
    console.log("Update room`s stage...", roomId, stage);

    try {
        const updatedRoom = await prisma.upworkRooms.update({ where: { roomId }, data: { stage } });
        if (!updatedRoom) {
            console.log("Failed to update room stage", updatedRoom);
            return { ok: false, message: "The room stage has been successfully updated." };
        }

        return  {ok: true, message: "The room stage has been successfully updated."};
    } catch (error: any) {
        console.error("URS: Update room`s stage error: ", error);
        return { ok: false, message: "Failed to update room stage" };
    }
}
