import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { fetchSiteByClientId, getClientById } from "@/app/actions";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/auth";
import { getUserById } from "@/app/actions";
import { WebsiteEditor } from "./website-editor";

type Props = {
  params: { clientId: string }
}

export const metadata = {
  title: 'Edit Website - Reputation Rhino',
  description: 'Website editing page',
}

export default async function EditWebsitePage({ params }: Props) {
  const session = await getServerSession(authOption) as any;
  const userId = session?.user?.id;

  if (!userId) redirect("/api/auth/signin");

  const userFromDB = await getUserById(userId);
  if (!userFromDB) redirect("/utility/unauthorized");

  const clientId = params.clientId;

  const client = await getClientById(clientId);
  if (!client) redirect("/utility/unauthorized");

  const website = await fetchSiteByClientId(clientId);
  if (!website) notFound();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
          Edit Website ✏️ {client.clientName}
        </h1>
      </div>
      <Suspense fallback={<div className="flex justify-center items-center h-full text-center">Loading...</div>}>
        <WebsiteEditor website={website} clientData={client} />
      </Suspense>
    </div>
  )
} 