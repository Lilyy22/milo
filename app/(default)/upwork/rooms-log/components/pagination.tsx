export default function Pagination({ total, start, end, setCurrentPage, currentPage, steps }: {
    steps: number, total: number, start: number, end: number, currentPage: number, setCurrentPage: Function
}) {

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">

            <nav className="mb-4 sm:mb-0 sm:order-1" role="navigation" aria-label="Navigation">
                <ul className="flex justify-center">
                    <li className="ml-3 first:ml-0" onClick={() => currentPage !== 1 && setCurrentPage(currentPage - 1)}>
                        <div
                            className={`btn  bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 ${currentPage <= 1 ? "text-slate-300" +
                                " dark:text-slate-600" : "hover:border-slate-300 dark:hover:border-slate-600 text-indigo-500 cursor-pointer"}`}>&lt;- Previous
                        </div>
                    </li>

                    <li className="ml-3 first:ml-0 pointer" onClick={() => currentPage !== steps && setCurrentPage(currentPage + 1)}>
                        <div className={`btn bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 ${currentPage >= steps
                            ? "text-slate-300" +
                            " dark:text-slate-600" : "hover:border-slate-300 dark:hover:border-slate-600 text-indigo-500 cursor-pointer"}`}>Next -&gt;
                        </div>
                    </li>
                </ul>
            </nav>

            <div className="text-sm text-slate-500 dark:text-slate-400 text-center sm:text-left">
                Showing <span className="font-medium text-slate-600 dark:text-slate-300">{start}</span> to <span
                className="font-medium text-slate-600 dark:text-slate-300">{end < total ? end : total}</span> of <span
                className="font-medium text-slate-600 dark:text-slate-300">{total}</span> results
            </div>
        </div>
    );
}
