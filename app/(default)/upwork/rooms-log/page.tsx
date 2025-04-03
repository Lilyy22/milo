"use client";
import { useEffect, useRef, useState } from "react";
import { SelectedItemsProvider } from "@/app/selected-items-context";
import { IUpworkRoomItem, UpworkStatPeriod } from "@/app/types";
import UpworkTable from "./components/upwork-rooms-table";
import DateSelect from "@/app/(default)/upwork/rooms-log/components/upwork-data-select";
import Pagination from "@/app/(default)/upwork/rooms-log/components/pagination";
import DrawerRoom from "@/app/(default)/upwork/rooms-log/components/DrawerRoom";
import { useNotification } from "@/app/notifications-context";
import Spinner from "@/components/Spinner";
import ErrorPage from "@/components/Error-page";
import Filter from "@/app/(default)/upwork/rooms-log/components/Filter";
import { getUpworkRooms } from "@/app/(default)/upwork/rooms-log/actions/actionGetRooms";
import { useSessionContext } from "@/app/session-context";


export default function UpworkStatistics() {
    const { session, loading: sessionLoading } = useSessionContext() as any;
    const isFetching = useRef(false);
    const { addNotification } = useNotification();
    const [statData, setStatData] = useState<IUpworkRoomItem[] | null>(null);
    const [error, setError] = useState<string>("");
    const [period, setPeriod] = useState<UpworkStatPeriod>("week");
    const [loading, setLoading] = useState<Boolean>(true);
    const [roomsForRender, setRoomsForRender] = useState<IUpworkRoomItem[]>([]);
    const [pagination, setPagination] = useState<number>(0); // amount og rows if pagination
    const [steps, setSteps] = useState<any>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [roomModalOpen, setRoomModalOpen] = useState<IUpworkRoomItem | null>(null);
    const [agents, setAgents] = useState<string[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<string[]>([]);
    const [filteredData, setFilteredData] = useState<IUpworkRoomItem[] | null>(null);
    const [canUse, setCanUse] = useState<Boolean>(false);
    const [ttr, setTtr] = useState<boolean>(false);


    // region Get user role
    useEffect(() => {
        if (sessionLoading) return;
        if (!session?.user) {
            console.error("Failed to get user");
            addNotification("Failed to get user info. Please try reload the page", "error");
            return;
        }

        const canUseResult = Boolean(
            session?.user?.role === "Superadmin" || session?.user?.role === "BDM" || session?.user?.name === "Andrey Korchevnyi_");
        if (!canUseResult) {
            addNotification("You don`t have access to the page", "warning");
        }
        setCanUse(canUseResult);// eslint-disable-next-line
    }, [loading, session?.user]);
    // endregion

    // region Fetch rooms func
    async function fetchRooms(): Promise<IUpworkRoomItem[] | null> {
        try {
            const rooms = await getUpworkRooms(period) as IUpworkRoomItem[] | null;
            if (!rooms) {
                console.error("Failed to get upwork stat", rooms);
                addNotification("Failed to get upwork rooms. Please try to reload the page.", "error");
                setError("Failed to get upwork rooms. Please try to reload the page.");
                setLoading(false);
                return null;
            }

            console.log("FR: Rooms: ", rooms);
            setStatData(rooms);
            setFilteredData(rooms);
            setAgents(Array.from(new Set(rooms.map(room => room.agent))).filter(agent => Boolean(agent)));
            return rooms;
        } catch (error) {
            console.error("Error while fetching room list: ", error);
            setError("Error while fetching room list. Please try reload the page.");
            addNotification("Error while fetching room list. Please try reload the page.", "error");
            setLoading(false);
            return null;
        }
    }

    // endregion

    // region Initial useEffect - fetch rooms log
    useEffect(() => {

        console.log("==== canUse ==> ", canUse);
        if (!sessionLoading && !canUse) {
            setLoading(false);
        }

        if (!canUse || isFetching.current) return;
        setLoading(true);

        (async () => {
            isFetching.current = true;
            try {
                await fetchRooms();
            } catch (error) {
                console.error("Failed to fetch stat on start", error);
                addNotification("Failed to fetch room list. Please try to reload the page", "error");
                setError("Error while fetching room list. Please try reload the page");
                setLoading(false);
            }
        })();// eslint-disable-next-line
    }, [canUse, sessionLoading]);
    // endregion

    // region re-fetch rooms with new region
    useEffect(() => {
        if (loading) return;

        setLoading(true);
        setRoomsForRender([]);
        setSteps(0);
        setPagination(0);
        setCurrentPage(1);

        (async () => {
            try {
                await fetchRooms();
            } catch (error) {
                console.error("Failed to fetch stat", error);
                addNotification("Failed to fetch room list for the period. Please try to reload the page", "error");
                setError("Error while fetching room list for the period. Please try reload the page");
                setLoading(false);
            }
        })();// eslint-disable-next-line
    }, [period]);
    // endregion

    // region Calculate pagination
    useEffect(() => {
        if (!filteredData) return;
        if (!filteredData.length) {
            setLoading(false);
            return;
        }

        const calculateVisibleRows = () => {
            const rows = Math.floor((window.innerHeight - 223) / 51); // 51 - one row height, 253 - header  height
            const paginationRows = Math.floor((window.innerHeight - 420) / 51); //  - 365 - header + footer height
            if (filteredData.length < (rows - 2)) {
                setRoomsForRender(filteredData);
                setSteps(0);
                setPagination(0);
                setLoading(false);
                return;
            }

            const stepsAmount = Math.ceil(filteredData.length / paginationRows);
            setSteps(stepsAmount);
            setPagination(paginationRows);
            setLoading(false);
        };

        calculateVisibleRows();

        window.addEventListener("resize", calculateVisibleRows);
        return () => {
            window.removeEventListener("resize", calculateVisibleRows);
        };// eslint-disable-next-line
    }, [filteredData]);
    // endregion

    // region Calculate rooms bunch for render
    useEffect(() => {
        if (!filteredData?.length) return;

        if (!pagination) {
            setRoomsForRender(filteredData);
        }
        else {
            const start = pagination * (currentPage - 1);
            const end = start + pagination;
            setRoomsForRender(filteredData.slice(start, end));
        }

        setLoading(false);
    }, [pagination, currentPage, filteredData]);
    // endregion

    // region Handle on room click
    const handleRowClick = (roomId: string) => {
        const room = roomsForRender.find((room) => room.roomId === roomId);
        if (!room) {
            console.error("Failed to get room", roomId);
            setError("Failed to get room. Please try to reload the page");
            addNotification("Failed to get room info rooms. Please try to reload the page.", "error");
            return;
        }
        setRoomModalOpen(room);
    };
    // endregion

    // region Filer by ttr and agents
    useEffect(() => {
        if (!statData) return;

        const appliedFilters = statData
            .filter(agent => selectedAgent.length ? agent.authors.some(author => selectedAgent.includes(author)) : agent)
            .filter(agent => ttr ? agent.TTR > 10 : agent);
        console.log("==== appliedFilters ==> ", appliedFilters);

        setFilteredData(appliedFilters);
    }, [selectedAgent, statData, ttr]);
    // endregion

    return (
        <SelectedItemsProvider>

            {loading ?
                <Spinner/> :
                <>{canUse ? <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
                        {/*region Header*/}
                        <div className="sm:flex sm:justify-between sm:items-center mb-5">

                            <div className="sm:flex sm:justify-between sm:items-center mb-5">
                                <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">Upwork Rooms</h1>
                            </div>

                            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                                {/* Dropdown */}
                                <DateSelect period={period} setPeriod={setPeriod}/>
                                {/* Filter button */}
                                <Filter align="right" agents={agents} setSelectedAgent={setSelectedAgent} ttr={ttr} setTtr={setTtr}/>
                            </div>

                        </div>
                        {/*endregion*/}

                        {error ?
                            <ErrorPage message={error}/> :
                            <>
                                {filteredData ?
                                    <>
                                        {!filteredData.length ?
                                            <ErrorPage message="It seems you don't have any synchronized rooms to display"/> :
                                            <>
                                                {/* region TableOfProjects */}
                                                <UpworkTable rooms={roomsForRender} total={filteredData.length} handleRowClick={handleRowClick}/>
                                                {/*endregion*/}

                                                {roomModalOpen && <DrawerRoom room={roomModalOpen} setRoomModalOpen={setRoomModalOpen}/>}

                                                {/* region Pagination */}
                                                {pagination ?
                                                    <div className="mt-8">
                                                        <Pagination total={filteredData.length} start={steps ? pagination * (currentPage - 1) + 1 : 0}
                                                                    end={pagination * currentPage} currentPage={currentPage}
                                                                    setCurrentPage={setCurrentPage} steps={steps}/>
                                                    </div> : null}
                                                {/* endregion*/}
                                            </>
                                        }
                                    </> : <ErrorPage message="No data to display"/>
                                }
                            </>
                        }
                    </div> :
                    <ErrorPage
                        message="You seem to not have access to this page. If you believe this is an error, please contact support for assistance."/>
                }</>

            }
        </SelectedItemsProvider>
    );
}
