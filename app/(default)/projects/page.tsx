import { SelectedItemsProvider } from "@/app/selected-items-context";
import ClientComponent from "./clientComponent";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/auth";
import { getUserById } from "@/app/actions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ClientData } from "../../types";

export const metadata = {
    title: "Projects - Reputation Rhino",
    description: "Project Tracker"
};
export const dynamic = 'force-dynamic';

async function fetchProjects(): Promise<ClientData[]> {
    try {
      return await prisma.clientData.findMany({
        include: {
          stages: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
    } catch (error) {
      console.error("Failed to fetch projects", error);
      return [];
    }
  }

export default async function ServerComponent() {
    
    const session = await getServerSession(authOption) as any;
    const userId = session?.user?.id;

    if (!userId) {
        redirect("/utility/unauthorized");
        return null;
    }

    const userFromDB = await getUserById(userId);

    if (!userFromDB) {
        redirect("/utility/unauthorized");
        return null;
    }

    const projects = await fetchProjects();
    
    
    return (
        <SelectedItemsProvider>
            <ClientComponent projects={projects} user={userFromDB} />
        </SelectedItemsProvider>
    );
}