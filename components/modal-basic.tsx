import { Dialog, Transition } from "@headlessui/react";

interface ModalBasicProps {
    children: React.ReactNode;
    title: string;
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

export default function ModalBasic({
    children,
    title,
    isOpen,
    setIsOpen
}: ModalBasicProps) {
    return (
        <Transition appear show={isOpen}>
            <Dialog as="div" onClose={() => setIsOpen(false)}>
                <Transition.Child className="fixed inset-0 bg-slate-900 bg-opacity-30 z-50 transition-opacity"
                                  enter="transition ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
                                  leave="transition ease-out duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" aria-hidden="true"/>
                <Transition.Child className="fixed inset-0 z-50 overflow-hidden flex items-center my-4 justify-center px-4 sm:px-6"
                                  enter="transition ease-in-out duration-200" enterFrom="opacity-0 translate-y-4" enterTo="opacity-100 translate-y-0"
                                  leave="transition ease-in-out duration-200" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-4">
                    <Dialog.Panel className="bg-white dark:bg-slate-800 rounded shadow-lg overflow-auto max-w-2xl w-full max-h-full">
                        {/* Modal header */}
                        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-700">
                            <Dialog.Title className="font-semibold text-slate-800 dark:text-slate-100">{title}</Dialog.Title>
                        </div>
                        {children}
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}
