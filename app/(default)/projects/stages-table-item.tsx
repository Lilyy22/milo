import { Stage, TimeLog } from "@/app/types";
import { useState, useEffect } from "react";
import EditStageForm from "./editStage/edit-stage";
import ModalBasic from "@/components/modal-basic";
import DeleteStageWarning from "./actionsStageDropdown/delete-stage-warning";
import ModalBlank from "@/components/modal-blank";
import StatusCheckbox from "./stageStatusCheckbox/stage-status-checkbox";
import WarningIcon from "@/components/icons/warning-icon";
import EditIcon from "@/components/icons/edit-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import AddReportStageForm from "./stageStatusCheckbox/add-report-stage";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StatusDropdown from "./statusDropdown/status-dropdown";
import { ProjectsProperties } from './projects-properties';

export default function StagesTableItem({ stage, docUrl }: { stage: Stage, docUrl: string}) {
    const [editStageModalOpen, setEditStageModalOpen] = useState(false);
    const [dangerStageModalOpen, setDangerStageModalOpen] = useState(false);
    const [addReportStageModalOpen, setAddReportStageModalOpen] = useState(false);
    const { statusColor } = ProjectsProperties();
    const getStatusesForDocType = (docType: string) => {
        switch (docType) {
          case "Article":
            return ["Generating", "Failed", "Ready"];
          case "Video":
            return [
              "Generating video",
              "Failed",
              "Video ready",
              "Generating SEO",
              "Video & SEO Ready",
            ];
          default:
            return ["Unknown Status"]; // Handle unknown types
        }
      };
    const formatDate = (isoString: string): string => {
        if (!isoString) return ''; // Return empty string if isoString is undefined
        const date = new Date(isoString);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      };
    

    return (
        <tr className={
            stage.status === "Ready"
                ? "group transition-all duration-75"
                : "text-slate-500 group transition-all duration-75"
        }>
            <td className="px-2 first:pl-5 last:pr-5 py-1 whitespace-nowrap">
                <div className="flex items-center justify-end pr-5">
                <div>
      {docUrl || stage?.docUrl ? (
        <Link href={stage?.docUrl || docUrl} passHref legacyBehavior>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-slate-800 dark:text-slate-100 text-left truncate cursor-pointer underline"
          >
            {stage.name}
          </a>
        </Link>
      ) : (
        <span>{stage.name}</span>
      )}
    </div>
                </div>
            </td>
            <td className="px-2 first:pl-5 last:pr-5 py-1 whitespace-nowrap font-sm">
                <div className="text-center">
                    {/* {convertDecimalDurationToHHMM(stage.planHours)} */}
                </div>
            </td>
            <td className="px-2 first:pl-5 last:pr-5 py-1 whitespace-nowrap font-sm cursor-pointer">
                <div className="text-left">
                {formatDate(stage?.createdAt?.toString())}
                </div>
            </td>
            <td className="px-2 first:pl-5 last:pr-5 py-1 whitespace-nowrap">
                <div className={`text-right font-sm`}></div>
            </td>
            <td className="px-2 first:pl-5 last:pr-5 py-1 whitespace-nowrap font-sm">
                <div className="text-left">
                    {stage.docType}
                </div>
            </td>
            <td className="px-2 first:pl-5 last:pr-5 py-1 whitespace-nowrap relative" >
                <StatusDropdown 
                    status={stage.status || ''} 
                    stageId={stage.id} 
                    statusColor={statusColor} 
                    statuses={getStatusesForDocType(stage.docType || '')}
                />
            </td>
            {/* <td className="px-2 first:pl-5 last:pr-5 py-1 whitespace-nowrap">
        <div className={`text-right font-sm`}>{"   "}</div>
      </td> */}
            <td className="px-1 first:pl-5 last:pr-5 py-0.5 min-w-[10rem]">
                <div className="text-left flex gap-1 justify-center items-center">
                    {/* Actions */}
                    <div className="group-hover:flex hidden">
                        <button className={`hover:scale-105 items-center justify-between w-full  cursor-pointer`}
                                onClick={() => setEditStageModalOpen(true)}>
                            <EditIcon className="m-0 h-7 w-7 fill-current dark:hover:text-slate-100 hover:scale-105 transition-all duration-100"/>
                        </button>
                        <button className={`hover:scale-105 items-center justify-between w-full  cursor-pointer`}
                                onClick={() => setDangerStageModalOpen(true)}>
                            <DeleteIcon className="m-0 h-7 w-7 dark:hover:text-rose-600 fill-current hover:scale-105 transition-all duration-100"/>
                        </button>
                    </div>
                </div>
                

                {/* Edit Modal */}
                <ModalBasic isOpen={editStageModalOpen} setIsOpen={setEditStageModalOpen} title={`Edit Project: ${stage.name}`}>
                    <EditStageForm stage={stage} setEditStageModalOpen={setEditStageModalOpen}/>
                </ModalBasic>

                {/* Delete Modal */}
                <ModalBlank isOpen={dangerStageModalOpen} setIsOpen={setDangerStageModalOpen}>
                    <DeleteStageWarning setDangerStageModalOpen={setDangerStageModalOpen} stageId={stage.id}/>
                </ModalBlank>
            </td>
        </tr>
    );
}

