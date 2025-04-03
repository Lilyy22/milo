
import { IUpworkRoomItem } from "@/app/types";
import UpworkTableItem from "./upwork-table-item";
import ErrorPage from "@/components/Error-page";


export default function UpworkTable({ rooms, total, handleRowClick }: { rooms: IUpworkRoomItem[], total: number, handleRowClick: Function }) {

    return (
        <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
            {rooms ?
                <>
                    {/*region Header*/}
                    <header className="px-5 py-4">
                        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                            Rooms
                            <span className="ml-3 text-slate-400 dark:text-slate-500 font-medium">{total}</span>
                        </h2>
                    </header>
                    {/*endregion*/}

                    <div className="overflow-x-auto">
                        <table className="table-auto w-full dark:text-slate-300">

                            {/* region TableOfProjects header */}
                            <thead
                                className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20 border-t border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                        <div className="font-semibold text-left">Last Activity date</div>
                                    </th>

                                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                        <div className="font-semibold text-left">Client</div>
                                    </th>

                                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                        <div className="font-semibold text-left">Deal stage</div>
                                    </th>

                                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                        <div className="font-semibold text-left">Agent (last message author)</div>
                                    </th>
                                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                        <div className="font-semibold text-left">Messages</div>
                                    </th>
                                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                        <div className="font-semibold text-left">TTR, <span className="lowercase">hh:mm</span></div>
                                    </th>
                                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                        <div className="font-semibold text-left">Room created</div>
                                    </th>
                                    <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                        <div className="font-semibold text-left">Last Message Author</div>
                                    </th>
                                </tr>
                            </thead>
                            {/*endregion*/}

                            {/* region TableOfProjects body */}
                            <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                                {rooms && rooms.map((room: IUpworkRoomItem) => (
                                    <UpworkTableItem key={room.roomId} room={room} handleRowClick={handleRowClick}/>
                                ))}
                            </tbody>
                            {/*    endregion*/}

                        </table>
                    </div>
                </> :
                <ErrorPage message="It seems you don't have any synchronized rooms to display"/>
            }
        </div>
    );
}
