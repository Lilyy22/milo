import { Project } from "@/app/types";
import { useState } from "react";
import ModalBlank from "@/components/modal-blank";
import DeleteWarning from "./deletWarning/delete-warning";
import ModalBasic from "@/components/modal-basic";
import StagesTableItem from "./stages-table-item";
import AddStageForm from "./addNewStage/add-new-stage";
import { useNotification } from "@/app/notifications-context";
import EditIcon from "@/components/icons/edit-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import WebsiteIcon from "@/components/icons/website-icon";
import { useRouter } from "next/navigation";
import AddQAForm from "./addNewQa/add-new-qa";


interface ProjectsTableItemProps {
    project: Project;
}

const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];


export default function ProjectsTableItem({ project }: ProjectsTableItemProps) {
    const router = useRouter()
    const { addNotification } = useNotification();
    const [dangerModalOpen, setDangerModalOpen] = useState<boolean>(false);
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [addStageModalOpen, setAddStageModalOpen] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState(false);
    const [addQAModalOpen, setAddQAModalOpen] = useState<boolean>(false);
    const stagesSorted = [...project?.stages].sort((a, b) => {
        const getDateString = (date: string | Date | undefined) =>
            date ? (date instanceof Date ? date.toISOString() : date) : '';
        return getDateString(a.createdAt).localeCompare(getDateString(b.createdAt));
    });
    const [stageDocUrl, setStageDocUrl] = useState<string>('');
    function handleSetUrl(url: string): void {
        setStageDocUrl(url);
    }

    const formatDate = (isoString: string | undefined): string => {
        if (!isoString) return ''; // Return empty string if isoString is undefined
        const date = new Date(isoString);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    };
    if (!project) return <div>Loading...</div>;

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <tbody className="text-sm">
                {/* Project Row (Accordion Header) */}
                <tr
                    className="bg-slate-50 dark:bg-slate-900/20 border-t border-b border-slate-200 dark:border-slate-700 group cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/30"
                    onClick={toggleAccordion}
                >
                    <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 text-left truncate">
                                {project?.clientName}
                            </span>
                            {project.archived && (
                                <span className="text-yellow-700/70 text-xs ml-2 italic">
                                    Archived
                                </span>
                            )}
                        </div>
                    </td>
                    <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap text-left">
                        <div>
                            {/* {project?.clientEmail}  */}
                        </div>
                    </td>
                    <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap text-left">
                        <div className="font-medium text-slate-800 dark:text-slate-100 cursor-pointer">
                            {formatDate(project?.createdAt?.toString())}
                        </div>
                    </td>
                    <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2 justify-center">
                            {/* {convertDecimalDurationToHHMM(totalBilled)} {billedIcon} */}
                        </div>
                    </td>
                    <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-left font-medium">
                            {/* {dueTime ? `${month}-${day}` : "-"} {dueIcon} */}
                        </div>
                    </td>
                    <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        {/* <StatusDropdown projectId={project.id} status={'Ok'} statusColor={'green'}/> */}
                    </td>
                    <td className="px-1 first:pl-5 last:pr-5 py-0.5 min-w-[10rem]">
                        <div className="text-left flex gap-1 justify-center items-center">
                            <div className="group-hover:flex hidden">
                                <button className={`flex items-center justify-between w-full cursor-pointer`} onClick={() => router.push(`/add-project?id=${project.id}`)}>
                                    <EditIcon
                                        className="m-0 h-7 w-7 fill-current dark:hover:text-slate-100 hover:scale-105 transition-all duration-100" />
                                </button>
                                <button className={`flex items-center justify-between w-full cursor-pointer`}
                                    onClick={() => setDangerModalOpen(true)}>
                                    <DeleteIcon
                                        className="m-0 h-7 w-7 dark:hover:text-rose-600 fill-current hover:scale-105 transition-all duration-100" />
                                </button>
                                <button className={`flex items-center justify-between w-full cursor-pointer`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setAddQAModalOpen(true);
                                    }}>
                                    <svg className="m-0 h-7 w-7 fill-current dark:hover:text-green-500 hover:scale-105 transition-all duration-100" viewBox="0 0 24 24">
                                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                    </svg>
                                </button>
                                {/* <button className={`flex items-center justify-between w-full cursor-pointer`}
                                    onClick={() => router.push(`/create-website/${project.id}`)}>
                                    <WebsiteIcon />
                                </button> */}
                            </div>
                            {/* Edit Modal */}
                            {/* <ModalBasic isOpen={editModalOpen} setIsOpen={setEditModalOpen} title={`Edit Project: ${
                                project.name + " [" + project.clientName + "]"
                            }`}> */}
                            {/* <EditProjectForm project={project} setEditModalOpen={setEditModalOpen}/> */}
                            {/* </ModalBasic> */}
                            {/* Edit Modal */}
                            {/* Danger Modal */}
                            <ModalBlank isOpen={dangerModalOpen} setIsOpen={setDangerModalOpen}>
                                <DeleteWarning projectId={project.id} setDangerModalOpen={setDangerModalOpen} />
                            </ModalBlank>
                            {/* Danger Modal */}
                            <ModalBasic isOpen={addQAModalOpen} setIsOpen={setAddQAModalOpen} title={`Add Q&A for ${project.clientName}`}>
                                <AddQAForm
                                    setAddQAModalOpen={setAddQAModalOpen}
                                    projectId={project.id}
                                    setUrl={handleSetUrl}
                                    stages={stagesSorted.map(stage => ({
                                        id: stage.id,
                                        docType: stage.docType,
                                        docUrl: stage.docUrl || '',
                                        name: stage.name,
                                    }))}
                                    thisProject={project}
                                />
                            </ModalBasic>
                        </div>
                    </td>
                    <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <svg className={`w-8 h-8 shrink-0 fill-current text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400 ml-3 ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 32 32">
                            <path d="M16 20l-5.4-5.4 1.4-1.4 4 4 4-4 1.4 1.4z" />
                        </svg>
                    </td>
                </tr>

                {/* Stages (Accordion Content) */}
                {isOpen && (
                    <>
                        {stagesSorted?.length ? (
                            stagesSorted?.map((stage) => (
                                <StagesTableItem key={stage.id} stage={stage} docUrl={stageDocUrl} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-2 first:pl-5 last:pr-5 py-2 text-xs justify-center items-center text-center">
                                    No projects added to this client
                                </td>
                            </tr>
                        )}

                        {/* Add Stage button */}
                        <tr>
                            <td colSpan={8} className="px-2 first:pl-5 last:pr-5 pb-8 flex justify-end items-start">
                                {project?.stages?.length === 20 ? (
                                    <div className="ml-2 text-xs p-1 px-3 italic">
                                        {"* "} Maximum capacity reached, please consider deleting older stages if you need to add more. </div>
                                ) : (
                                    <button className={`ml-2 text-xs p-1 px-3 hover:scale-105 dark:text-gray-200 transition-all`}
                                        onClick={() => setAddStageModalOpen(true)}>
                                        + Start a project </button>
                                )}
                                <button
                                    className={`ml-2 text-xs p-1 px-3 hover:scale-105 dark:text-gray-200 transition-all bg-blue-500 text-white rounded-md`}
                                    onClick={() => router.push(`/create-website/${project.id}`)}
                                >
                                    Create Website
                                </button>
                                <ModalBasic isOpen={addStageModalOpen} setIsOpen={setAddStageModalOpen} title={`Add Project for ${project.clientName
                                    }`}>
                                    <AddStageForm
                                        setAddStageModalOpen={setAddStageModalOpen}
                                        projectId={project.id}
                                        setUrl={handleSetUrl}
                                        thisProject={project}
                                        stages={stagesSorted.map(stage => ({
                                            id: stage.id,
                                            docType: stage.docType,
                                            docUrl: stage.docUrl || '',
                                            name: stage.name,
                                        }))}
                                    />
                                </ModalBasic>
                            </td>
                        </tr>
                    </>
                )}
            </tbody>
        </>
    );
}
