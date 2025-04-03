import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { updateStatusProject } from "@/app/actions";
import { useNotification } from "@/app/notifications-context";

export default function StatusDropdown({
  status,
  stageId,
  statusColor,
  statuses,
}: {
  status: string;
  stageId: string;
  statusColor: (statusColor: string) => string;
  statuses: string[];
}) {
  const { addNotification } = useNotification();
  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatusProject(stageId, newStatus);
      addNotification(`Project status updated successfully`, "success");
    } catch (error) {
      addNotification(`Error updating project status`, "error");
    }
  };

  return (
      <Menu as="div" className="relative inline-flex w-fit">
        {({ open }) => (
            <>
              <Menu.Button
                  className={`btn w-full justify-between min-w-[4rem] hover:border-slate-300 dark:hover:border-slate-600 text-slate-500 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-200 py-1 ${statusColor(
                      status
                  )}`}
                  aria-label="Select option"
              >
                <span className="flex items-center">{status}</span>
                {/* <svg
                    className="shrink-0 ml-1 fill-current text-slate-400"
                    width="11"
                    height="7"
                    viewBox="0 0 11 7"
                >
                  <path d="M5.4 6.8L0 1.4 1.4 0l4 4 4-4 1.4 1.4z" />
                </svg> */}
              </Menu.Button>
              <Transition
                  className="z-10 absolute top-full left-0 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1"
                  enter="transition ease-out duration-100 transform"
                  enterFrom="opacity-0 -translate-y-2"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-out duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
              >
                <Menu.Items className="font-medium text-sm text-slate-600 dark:text-slate-300 divide-y divide-slate-200 dark:divide-slate-700 focus:outline-none">
                  <Menu.Item key={"edit"} as={Fragment}>
                    {({ active }) => (
                        <button
                            className={`flex items-center justify-between w-full py-1 px-1 cursor-pointer ${
                                active ? "bg-green-700/70" : ""
                            }`}
                            onClick={() => handleStatusChange("Ready")}
                        >
                          Ready
                        </button>
                    )}
                  </Menu.Item>
                  <Menu.Item key={"delete"} as={Fragment}>
                    {({ active }) => (
                        <button
                            className={`flex items-center justify-between w-full py-2 px-1 cursor-pointer ${
                                active ? "bg-yellow-700/70" : ""
                            }`}
                            onClick={() => handleStatusChange("Generating")}
                        >
                          Generating
                        </button>
                    )}
                  </Menu.Item>
                  <Menu.Item key={"archive"} as={Fragment}>
                    {({ active }) => (
                        <button
                            className={`flex items-center justify-between w-full py-1 px-1 cursor-pointer ${
                                active ? "bg-red-700/70" : ""
                            }`}
                            onClick={() => handleStatusChange("Failed")}
                        >
                          Failed
                        </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </>
        )}
      </Menu>
  );
}
