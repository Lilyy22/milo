import Image from "next/image";
import NotFoundImage from "@/public/images/404-illustration.svg";
import NotFoundImageDark from "@/public/images/404-illustration-dark.svg";

export default function ErrorPage({ message }: { message: string }) {
    return (
        <div className="flex h-[100dvh] overflow-hidden">
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-white dark:bg-slate-900">
                <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">

                    <div className="max-w-2xl m-auto mt-16 text-center px-4">
                        <div className="inline-flex mb-8">
                            <Image className="dark:hidden" src={NotFoundImage} width={176} height={176} alt="404 illustration"/>
                            <Image className="hidden dark:block" src={NotFoundImageDark} width={176} height={176} alt="404 illustration dark"/>
                        </div>
                        <div className="mb-6">{message}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
