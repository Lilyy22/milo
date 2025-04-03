import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export default async function Home() {
    const session = await getServerSession();

    const user = await prisma.user.findUnique({ where: { email: session?.user?.email || "" } });
    const role: string = user?.role || "";
    console.log("==== role ==> ", role);

    switch (role) {
        case "Developer":
            console.log("Redirect to /projects");
            return redirect("/projects");
        case "BDM":
            console.log("Redirect to /upwork/rooms-log");
            return redirect("/upwork/rooms-log");
        default:
            console.log("Redirect to /projects");
            return redirect("/projects");
    }
}
