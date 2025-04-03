"use client";
import { updateProject } from "@/app/actions";
import { useRef } from "react";
import type { addProject } from "@/app/actions";
import { ClientData } from "@/app/types";
import { useNotification } from "@/app/notifications-context";

export default function EditProjectForm({
  setEditModalOpen,
  project,
}: {
  setEditModalOpen: (addproject: boolean) => void;
  project: ClientData;
}) {
  const { addNotification } = useNotification();

  const ref = useRef<HTMLFormElement>(null);
  async function editProject(formData: FormData) {
    const data: addProject = {
      name: formData.get("name") as string,
      clientName: formData.get("clientName") as string,
      // hubspotLink: formData.get("hubspotLink") as string,

    };
    ref.current?.reset();
    try {
      // await updateProject(project.id, data);
      addNotification("Project edited successfully", "success");
    } catch (error) {
      console.log(error);
      addNotification("Error editing project", "error");
      ref.current?.reset();
    } finally {
      setEditModalOpen(false);
    }
  }

  function handleCancel() {
    ref.current?.reset();
    setEditModalOpen(false);
  }

  return (
      <div className="px-5 py-4">
        <form ref={ref} action={editProject} className="space-y-3">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Project Name
              </label>
              <input
                  type="text"
                  name="name"
                  required
                  // defaultValue={project.name}
                  className="form-input w-full px-2 py-1"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Client Name
              </label>
              <input
                  type="text"
                  name="clientName"
                  required
                  defaultValue={project.clientName}
                  className="form-input w-full px-2 py-1"
              />
            </div>
            {/* Add more input fields for other project properties */}
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                HubSpot Link
              </label>
              <input
                  type="text"
                  name="hubspotLink"
                  required
                  // defaultValue={project.hubspotLink}
                  className="form-input w-full px-2 py-1"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Trello Board Link
              </label>
              <input
                  type="text"
                  name="trelloBoardLink"
                  required
                  // defaultValue={project.trelloBoardLink}
                  className="form-input w-full px-2 py-1"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Upwork Profile
              </label>
              <input
                  type="text"
                  name="upworkProfile"
                  required
                  // defaultValue={project.upworkProfile}
                  className="form-input w-full px-2 py-1"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                  type="date"
                  name="startDate"
                  required
                  // defaultValue={project.startDate.toISOString().split("T")[0]}
                  className="form-input w-full px-2 py-1"
              />
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
                Edit Project
              </button>
            </div>
          </div>
        </form>
      </div>
  );
}
