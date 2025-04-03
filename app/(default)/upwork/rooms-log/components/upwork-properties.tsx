import { ReactElement } from "react";

export const UpworkProperties = () => {

    const totalColor = (status: string): string => {
        switch (status) {
            case "Paid":
                return "text-emerald-500";
            case "Due":
                return "text-amber-500";
            case "Overdue":
                return "text-rose-500";
            default:
                return "text-slate-500";
        }
    };

    const statusColor = (status: boolean): string => {
        switch (status) {
            case true:
                return "bg-emerald-100 dark:bg-green-400/30 text-green-600 dark:text-green-200";
            case false:
                return "bg-orange-200 dark:bg-orange-400/30 text-orange-600 dark:text-orange-200";
        }
    };

    const typeIcon = (type: string): ReactElement => {
        switch (type) {
            case "Subscription":
                return (
                    <svg className="w-4 h-4 fill-current text-slate-400 dark:text-slate-500 shrink-0 mr-2" viewBox="0 0 16 16">
                        <path
                            d="M4.3 4.5c1.9-1.9 5.1-1.9 7 0 .7.7 1.2 1.7 1.4 2.7l2-.3c-.2-1.5-.9-2.8-1.9-3.8C10.1.4 5.7.4 2.9 3.1L.7.9 0 7.3l6.4-.7-2.1-2.1zM15.6 8.7l-6.4.7 2.1 2.1c-1.9 1.9-5.1 1.9-7 0-.7-.7-1.2-1.7-1.4-2.7l-2 .3c.2 1.5.9 2.8 1.9 3.8 1.4 1.4 3.1 2 4.9 2 1.8 0 3.6-.7 4.9-2l2.2 2.2.8-6.4z"/>
                    </svg>
                );
            default:
                return (
                    <svg className="w-4 h-4 fill-current text-slate-400 dark:text-slate-500 shrink-0 mr-2" viewBox="0 0 16 16">
                        <path
                            d="M11.4 0L10 1.4l2 2H8.4c-2.8 0-5 2.2-5 5V12l-2-2L0 11.4l3.7 3.7c.2.2.4.3.7.3.3 0 .5-.1.7-.3l3.7-3.7L7.4 10l-2 2V8.4c0-1.7 1.3-3 3-3H12l-2 2 1.4 1.4 3.7-3.7c.4-.4.4-1 0-1.4L11.4 0z"/>
                    </svg>
                );
        }
    };

    return {
        totalColor,
        statusColor,
        typeIcon
    };
};
