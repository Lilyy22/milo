"use client";

import { Popover, Transition } from "@headlessui/react";
import { useEffect, useState } from "react";

export default function Filter({ align, agents, setSelectedAgent, ttr, setTtr }: {
    align?: "left" | "right", agents: string[], setSelectedAgent: Function, ttr: boolean, setTtr: Function
}) {
    const [selected, setSelected] = useState<string[]>([]);

    return (
        <Popover className="relative inline-flex">
            {/*region Button*/}
            <Popover.Button
                className="btn bg-white dark:bg-slate-800 border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600 text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300">
                <span className="sr-only">Filter</span>
                <wbr/>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
                    <path
                        d="M9 15H7a1 1 0 010-2h2a1 1 0 010 2zM11 11H5a1 1 0 010-2h6a1 1 0 010 2zM13 7H3a1 1 0 010-2h10a1 1 0 010 2zM15 3H1a1 1 0 010-2h14a1 1 0 010 2z"/>
                </svg>
            </Popover.Button>
            {/*endregion*/}

            <Transition
                className={`origin-top-right z-10 absolute top-full left-0 right-auto min-w-[14rem] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pt-1.5 rounded shadow-lg overflow-hidden mt-1 ${align ===
                "right" ? "md:left-auto md:right-0" : "md:left-0 md:right-auto"
                }`} enter="transition ease-out duration-200 transform" enterFrom="opacity-0 -translate-y-2" enterTo="opacity-100 translate-y-0"
                leave="transition ease-out duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">

                <Popover.Panel>
                    {({ close }) => (
                        <>
                            <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase pt-1.5 pb-2 px-3">Filters</div>

                            {/*region Filter by TTR*/}
                            <div className=" px-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/20"></div>
                            <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 pt-1.5 pl-3">By TTR</div>

                            <label className="py-1 px-3 flex items-center">
                                <input type="checkbox" className="form-checkbox" onChange={() => setTtr(!ttr)} checked={ttr}/>
                                <span className="text-sm font-medium ml-2">TTR &gt; 10 min</span>
                            </label>
                            {/*endregion*/}

                            {/*region Filter by Agents*/}
                            <div className="py-2 px-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/20"></div>
                            <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase pt-1.5 pb-2 px-3">By Agents</div>

                            <ul className="mb-4">
                                {agents.map((agent, key) => {
                                    return (
                                        <li key={key} className="py-1 px-3">
                                            <label className="flex items-center">
                                                <input type="checkbox" className="form-checkbox" onChange={(e) => {
                                                    setSelected((prev: string[]) => {
                                                        if (e.target.checked) {
                                                            return prev.includes(agent) ? prev : [...prev, agent];
                                                        }
                                                        else {
                                                            return prev.filter(a => a !== agent);
                                                        }
                                                    });
                                                }} checked={selected.includes(agent)}/>
                                                <span className="text-sm font-medium ml-2">{agent}</span>
                                            </label>
                                        </li>
                                    );
                                })}
                            </ul>
                            {/*endregion*/}

                            {/*region Buttons group*/}
                            <div className="py-2 px-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/20">
                                <ul className="flex items-center justify-between">
                                    <li>
                                        <button onClick={() => {
                                            setSelected([]);
                                            setTtr(false);
                                        }}
                                                className="btn-xs bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-500 dark:text-slate-300 hover:text-slate-600 dark:hover:text-slate-200">
                                            Clear
                                        </button>
                                    </li>
                                    <li>
                                        <button className="btn-xs bg-indigo-500 hover:bg-indigo-600 text-white" onClick={() => {
                                            setSelectedAgent(selected);
                                            close();
                                        }}>
                                            Apply
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            {/*    endregion*/}
                        </>
                    )}
                </Popover.Panel>
            </Transition>
        </Popover>
    );
}
