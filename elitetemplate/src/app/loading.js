import { Spinner } from "@/components/spinner";

export default function Loading() {
    return (
        <div className="w-full flex justify-center items-center h-[25vh]">
            <Spinner />
        </div>
    );
}