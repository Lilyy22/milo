"use client";
import { editStage, fetchUsers } from "@/app/actions";
import { editStageFunction } from "@/app/actions";
import React, { useEffect, useRef, useState } from "react";
import { useNotification } from "@/app/notifications-context";
import { Stage, User } from "@/app/types";

export default function EditStageForm({
    setEditStageModalOpen,
    stage
}: {
    setEditStageModalOpen: (addStage: boolean) => void;
    stage: Stage;
}) {
    const { addNotification } = useNotification();
    const ref = useRef<HTMLFormElement>(null);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);



    async function handleEditStage(formData: FormData) {
        const data: editStage = {
            name: formData.get("name") as string,
            docType: formData.get("docType") as string,
            clientDataId: stage.clientDataId.toString(), // Convert to string

        };
        ref.current?.reset();
        try {
            await editStageFunction(stage.id, data, selectedUsers);
            addNotification("Stage edited successfully", "success");
        } catch (error) {
            addNotification("Error editing Stage", "error");
            ref.current?.reset();
        } finally {
            setEditStageModalOpen(false);
        }
    }

    function handleCancel() {
        ref.current?.reset();
        setEditStageModalOpen(false);
    }


    return (
        <div className="px-5 py-4">
            <form ref={ref} action={handleEditStage} className="space-y-3">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Project Name
                        </label>
                        <input type="text" name="name" required defaultValue={stage.name} className="form-input w-full px-2 py-1"  style={{ marginTop: '0.36rem' }}/>
                    </div>
                    <div className="mb-2">  
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Project Type
                        </label>
                        <select name="docType" required defaultValue={"Article"}
                                className="form-input mt-1 block w-full px-2 py-1 bg-gray-300 dark:bg-gray-800 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white">
                            <option value="Article">Article</option>
                            {/* <option value="Inactive">Inactive</option> */}
                        </select>
                    </div>
                    
                
                </div>
                {/* <div className="mb-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Stage Users
                    </label>
                    <select className="form-select w-full px-2 py-1" onChange={handleUserSelect}>
                        <option value="">Select a user</option>
                        {availableUsers.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name || user.email}
                            </option>
                        ))}
                    </select>
                    <div className="mt-2 flex flex-wrap">
                        {selectedUsers.length ? (
                            selectedUsers.map((userId: string) => {
                                const user = users.find((u: User) => u.id === userId);
                                return (
                                    <span key={userId} className="text-sm  font-medium bg-sky-100 dark:bg-sky-500/30 text-sky-600 dark:text-sky-400 ml-4 px-2 py-1 pl-3 bg-indigo-600 rounded-md flex items-center">
                                    {user?.name || user?.email}
                                        <button type="button" className="ml-2 text-red-500" onClick={() => handleUserRemove(userId)}>
                                      &times;
                                    </button>
                                    </span>
                                );
                            })
                        ) : (
                            <span className="ml-5">No users selected</span>
                        )}
                    </div>
                </div> */}
                <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex flex-wrap justify-end space-x-2">
                        <button
                            className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                            onClick={handleCancel} type="button">
                            Cancel
                        </button>
                        <button type="submit" className="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white">
                            Edit Document
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}