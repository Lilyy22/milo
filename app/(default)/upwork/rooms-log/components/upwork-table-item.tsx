
import { IUpworkRoomItem } from "@/app/types";
import { format } from "date-fns";
import { UpworkProperties } from "@/app/(default)/upwork/rooms-log/components/upwork-properties";
import DropdownSwitch from "@/app/(default)/upwork/rooms-log/components/Dropdown-switch";


export default function UpworkTableItem({ room, handleRowClick }: { room: IUpworkRoomItem, handleRowClick: Function }) {
    const { statusColor } = UpworkProperties();

    return (
        <tr className="cursor-pointer">
            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap" onClick={() => handleRowClick(room.roomId)}>
                <p className="font-medium">{format(Number(room.recentTimestamp), "MM/dd/yyyy hh:mm a")}</p>
            </td>

            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-normal" onClick={() => handleRowClick(room.roomId)}>
                <div className={`font-medium`}>{room.client}</div>
            </td>

            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-normal">
                <DropdownSwitch roomId={room.roomId} currentStage={room.stage}/>
            </td>

            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap" onClick={() => handleRowClick(room.roomId)}>
                <div className={`inline-flex font-medium rounded-full text-center py-0.5`}>{room.agent}</div>
            </td>

            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap" onClick={() => handleRowClick(room.roomId)}>
                <div className="font-medium text-slate-800 dark:text-slate-100">{room.clientMessages}/{room.totalMessages}</div>
            </td>

            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap" onClick={() => handleRowClick(room.roomId)}>
                <div className={`inline-flex font-medium rounded-full text-center px-2.5 py-0.5 ${statusColor(room.TTR < 10)}`}>
                    {formatTimeInterval(room.TTR)}
                </div>
            </td>

            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap" onClick={() => handleRowClick(room.roomId)}>
                <div>{format(room.roomCreated, "MM/dd/yyyy hh:mm a")}</div>
            </td>

            <td onClick={() => handleRowClick(room.roomId)}>
                <div className={`inline-flex font-medium rounded-full text-center px-2.5 py-0.5  ${statusColor(
                    room.lastMessageAuthor !== room.client)}`}>
                    {room.lastMessageAuthor === room.client ? "client" : "agent"}
                </div>
            </td>
        </tr>
    );
}


function formatTimeInterval(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(remainingMinutes).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
}