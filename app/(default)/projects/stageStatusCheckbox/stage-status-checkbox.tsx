import { useState, useEffect } from "react";
import { updateStageStatusFunction } from "@/app/actions";
import { useNotification } from "@/app/notifications-context";

export default function StatusCheckbox({
  status,
  stageId,
  totalTimeLogged,
  report,
  setAddReportStageModalOpen,
}: {
  status: string;
  stageId: string;
  totalTimeLogged: number;
  report?: string;
  setAddReportStageModalOpen: (addReportStageModalOpen: boolean) => void;
}) {
  const [isChecked, setIsChecked] = useState(status === "Active");
  const { addNotification } = useNotification();

  const handleStatusChange = async () => {
    const newStatus = !isChecked;

    if (!newStatus && totalTimeLogged >= 1 && !report) {
      // if (!newStatus && totalTimeLogged >= 1) {
      setAddReportStageModalOpen(true);
      return;
    }
    try {
      await updateStageStatusFunction(stageId, newStatus ? "Active" : "Inactive");
      setIsChecked(newStatus);
      addNotification(`Stage status updated successfully`, "success");
    } catch (error) {
      addNotification(`Error updating stage status`, "error");
    }
  };

  useEffect(() => {
    setIsChecked(status === "Active");
  }, [status]);

  return (
      <div className="flex items-center">
        <div className="form-switch" style={{ transform: "scale(0.8)" }}>
          <input
              type="checkbox"
              id={`switch-${stageId}`}
              className="sr-only"
              checked={isChecked}
              onChange={handleStatusChange}
          />
          <label className="bg-slate-400 dark:bg-slate-700" htmlFor={`switch-${stageId}`}>
            <span className="bg-white shadow-sm" aria-hidden="true"></span>
            <span className="sr-only">Switch label</span>
          </label>
        </div>
        <div className="text-sm text-slate-400 dark:text-slate-500 italic ml-2">
          {isChecked ? "" : report ? report : ""}
        </div>
      </div>
  );
}
