import { redirect } from "next/navigation";
import { WebsiteGenerator } from "./website-generator"
import { Suspense } from "react";
import { fetchSiteByClientId } from "@/app/actions";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/auth";
import { getUserById, getClientById } from "@/app/actions";

type Props = {
  params: { clientId: string }
}

export const metadata = {
  title: 'Create Website - Reputation Rhino',
  description: 'Website generation page',
}


export default async function CreateWebsitePage({ params }: Props) {
  const session = await getServerSession(authOption) as any;
  const userId = session?.user?.id;

  if (!userId) redirect("/api/auth/signin");

  const userFromDB = await getUserById(userId);
  if (!userFromDB) redirect("/utility/unauthorized");

  const clientId = params.clientId;
  const client = await getClientById(clientId);
  if (!client) redirect("/utility/unauthorized");
  

  const existingWebsite = await fetchSiteByClientId(clientId);
  if (existingWebsite) redirect(`/edit-website/${clientId}`);
  
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
          Create Website ✨ {client.clientName}
        </h1>
      </div>
      <Suspense fallback={<div className="flex justify-center items-center h-full text-center">Loading...</div>}>
        <WebsiteGenerator clientData={client} />
      </Suspense>
    </div>
  )
}