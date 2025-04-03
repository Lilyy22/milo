"use server";
import { prisma } from "@/lib/prisma";


export async function createUpworkOrg(companyReference: string) {
    try {
        let org = await prisma.upworkOrg.findUnique({ where: { id: companyReference } });

        if (!org) {
            org = await prisma.upworkOrg.create({ data: { id: companyReference, isOur: true } });
        }

        return org;
    } catch (error) {
        console.error("Create upwork org error", error);
        return null;
    }
}

export async function getOurUpworkOrgs() {
    try {
        return await prisma.upworkOrg.findMany({ where: { isOur: true } });
    } catch (error) {
        console.error("Get upwork org error", error);
        return null;
    }
}
