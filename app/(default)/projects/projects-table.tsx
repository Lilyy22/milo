"use client";

import { Project } from "@/app/types";
import ProjectsTableItem from "./projects-table-item";
import { useEffect, useState } from "react";

export default function ProjectsTable({ projects }: { projects: Project[] }) {
    const [showArchived, setShowArchived] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterType, setFilterType] = useState<string>("all");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

    if (!projects) return <div>Loading...</div>;

    const projectsFiltered = showArchived
        ? projects
        : projects?.filter((project) => {
            return !project.archived;
        });

    const filteredProjects = projectsFiltered
        .filter((project) => 
            project.clientName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        // .filter((project) => {
        //     if (filterType === "all") return true;
        //     return project.documentType === filterType;
        // });

    const sortedProjects = sortOrder
        ? [...filteredProjects].sort((a, b) => {
            if (sortOrder === "asc") {
                return a.clientName.localeCompare(b.clientName);
            } else {
                return b.clientName.localeCompare(a.clientName);
            }
        })
        : filteredProjects;

    // const documentTypes = Array.from(new Set(projects.map(p => p.documentType)));

    const toggleSortOrder = () => {
        setSortOrder(current => {
            if (current === null) return "asc";
            if (current === "asc") return "desc";
            return null;
        });
    };

    return (
        <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
            <header className="flex justify-between items-center px-5 py-2">

                <h2 className="font-semibold text-slate-800 dark:text-slate-100 cursor-pointer">
                    All Clients{" "}
                    <span className="text-slate-400 dark:text-slate-500 font-medium">
                            {projectsFiltered.length}
                        </span>
                </h2>

                <div className="flex justify-center items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input w-full focus:border-slate-300 rounded-md"
                    />
                    {/* <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-2 py-1 border rounded"
                    >
                        <option value="all">All Types</option>
                        {documentTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select> */}

                    <button className="btn bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm whitespace-nowrap" onClick={toggleSortOrder}>
                        Sort by Client Name {sortOrder === "asc" ? "↑" : sortOrder === "desc" ? "↓" : ""}
                    </button>
                </div>
            </header>
            <div>
                {/* Table */}
                <div className="overflow-x-auto pb-20">
                    <table className="table-auto w-full dark:text-slate-300 divide-y divide-slate-200 dark:divide-slate-700">
                        {/* Table header */}
                        <thead
                            className="text-xs uppercase text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 shadow-lg rounded-sm border-t border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                    <div className="font-semibold text-left">Client</div>
                                </th>
                                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                    <div className="font-semibold text-left"></div>
                                </th>
                                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                    <div className="font-semibold text-left">Created at</div>
                                </th>
                                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                    <div className="font-semibold"></div>
                                </th>
                                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                    <div className="font-semibold text-left">Document type</div>
                                </th>
                                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                    <div className="font-semibold text-left">Status</div>
                                </th>
                                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                    <div className="font-semibold text-center">Action</div>
                                </th>
                            </tr>
                        </thead>
                        {/* Table body */}
                        {sortedProjects.map((project) => (
                            <ProjectsTableItem key={project.id} project={project}/>
                        ))}
                    </table>
                </div>
            </div>
        </div>
    );
}
