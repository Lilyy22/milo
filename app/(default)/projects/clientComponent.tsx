"use client";

import { useState, useEffect } from "react";
import ProjectsTable from "./projects-table";
import { ClientData, User } from "../../types"; // Adjust the path as needed
import { redirect, useRouter } from "next/navigation";

type ClientComponentProps = {
    projects: any;
    user: User;
};

export default function ClientComponent({ projects, user }: ClientComponentProps) {
    const [addProject, setAddProject] = useState<boolean>(false);
    const router = useRouter()

    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh(); // This will refresh the component
        }, 30000); // 30 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [router]);

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
                <div className="mb-4 sm:mb-0">
                    <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
                        Clients ✨
                    </h1>
                </div>
                {/* Add Project Modal */}
                <div className="m-1.5">
                    <button className="w-full btn sm:w-auto text-white bg-indigo-500 hover:bg-indigo-600"
                            onClick={() => router.push('/add-project')}>
                        <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                            <path
                                d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z"/>
                        </svg>
                        <span className="hidden xs:block ml-2">Add Client</span>
                    </button>
                    {/* <ModalBasic isOpen={addProject} setIsOpen={setAddProject} title="Add Project">
                        <AddProjectForm setAddProject={setAddProject}/>
                    </ModalBasic> */}
                </div>
                {/* Add Project Modal */}
            </div>
            <ProjectsTable projects={projects} />
        </div>
    );
}
