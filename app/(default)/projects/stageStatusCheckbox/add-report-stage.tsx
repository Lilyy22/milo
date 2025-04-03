
"use client";
import { useState, useRef } from "react";
import { useNotification } from "@/app/notifications-context";
import { Stage } from "@/app/types";

export default function AddReportStageForm({
  setAddReportStageModalOpen,
  latelestTimeLogged,
  stage,
}: {
  setAddReportStageModalOpen: (addStage: boolean) => void;
  stage: Stage;
  latelestTimeLogged: Date | null;
}) {
  const { addNotification } = useNotification();
  const [isChecked, setIsChecked] = useState(stage.active);

  const ref = useRef<HTMLFormElement>(null);

  async function handleEditStage(formData: FormData) {
    const report = formData.get("report") as string;
    ref.current?.reset();

    if (!report) {
      addNotification("Complete this report");
      return
    }

    try {
      // await updateReportFunction(stage.id, report, latelestTimeLogged);
      addNotification("Report added and status changed successfully", "success");
    } catch (error) {
      addNotification("Error updating Stage", "error");
      ref.current?.reset();
    } finally {
      setAddReportStageModalOpen(false);
    }
  }

  function handleCancel() {
    ref.current?.reset();
    setAddReportStageModalOpen(false);
  }

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
      <div className="px-5 py-4">
        <form ref={ref} action={handleEditStage} className="space-y-3">
          <div className="mb-2">
            <label className="block text-sm mb-4 font-medium text-slate-700 dark:text-slate-300">
              This Stage has hours logged, if you want to deactivate it, we need
              you to fill this report
            </label>
            <textarea
                name="report"
                rows={4}
                defaultValue={stage.report}
                className="form-input w-full px-2 py-1"
            />
          </div>
          <div className="flex items-center">
            <div className="form-switch">
              <input
                  type="checkbox"
                  id={`switch-${stage.id}`}
                  className="sr-only"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
              />
              <label className="bg-slate-400 dark:bg-slate-700" htmlFor={`switch-${stage.id}`}>
                <span className="bg-white shadow-sm" aria-hidden="true"></span>
                <span className="sr-only">Switch label</span>
              </label>
            </div>
            <div className="text-sm text-slate-400 dark:text-slate-500 italic ml-2">
              {isChecked ? "Active" : "No Active"}
            </div>
          </div>
          <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap justify-end space-x-2">
              <button
                  className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                  onClick={handleCancel}
                  type="button"
              >
                Cancel
              </button>
              <button
                  type="submit"
                  className="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                Add Report and Deactivate
              </button>
            </div>
          </div>
        </form>
      </div>
  );
}
