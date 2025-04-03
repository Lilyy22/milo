"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { WebsiteData } from "./types";

//Projects
export type addProject = {
    name: string;
    clientName: string;
    clientEmail?: string
    inspiration?: string;
    definingMoment?: string;
    values?: string;
    advice?: string;
    achievements?: string;
    stressManagement?: string;
    successDefinition?: string;
    inspirationLeader?: string;
    communityService?: string;
    inspirationalStory?: string;
    fileUrl?: string;
};

//Stages
export type addStage = {
    name: string;
    article: string;
    clientDataId: string;
    docType: string;
    projectId: string;
    docUrl?: string;
    category?: string;
};
// editStages
export type editStage = {
    name: string;
    clientDataId: string;
    docType: string;

};

// - - - - -  Projects functions - - - - -
// export async function createProject(data: addProject) {
//     try {
//         const newProject = await prisma.clientData.create({
//             data: {
//                 clientName: data.clientName,
//                 // inspiration: data.inspiration || '',
//                 definingMoment: data.definingMoment || '',
//                 values: data.values || '',
//                 advice: data.advice || '',
//                 achievements: data.achievements || '',
//                 stressManagement: data.stressManagement || '',
//                 successDefinition: data.successDefinition || '',
//                 inspirationLeader: data.inspirationLeader || '',
//                 communityService: data.communityService || '',
//                 inspirationalStory: data.inspirationalStory || '',
//                 fileUrl: data.fileUrl || ''
//             }
//         });
//         if (newProject) {
//             revalidatePath("/projects");
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }


export async function getClientById(clientId: string) {
    try {
        const client = await prisma.clientData.findUnique({
            where: { id: parseInt(clientId) }
        });
        return client;
    } catch (error) {
        console.error("Failed to fetch client:", error);
        return null;
    }
}

export async function updateProject(id: string, data: addProject) {
    try {
        const updatedProject = await prisma.clientData.update({
            where: { id: parseInt(id) },
            data
        });

        if (updatedProject) {
            revalidatePath("/projects");
        }
    } catch (error) {
        console.log(error);
    }
}

export async function deleteProject(id: string) {
    try {

        // Delete related stages
        await prisma.stage.deleteMany({
            where: { clientDataId: parseInt(id) }
        });

        // Now delete project
        const deletedProject = await prisma.clientData.delete({
            where: { id: parseInt(id) }
        });

        if (deletedProject) {
            revalidatePath("/projects");
        }
    } catch (error) {
        console.log(error);
    }
}




//update status project function
export async function updateStatusProject(id: string, statusUpdate: string) {
    try {

        const updatedProject = await prisma.stage.update({
            where: { id },
            data : { status: statusUpdate }
        });

        if (updatedProject) {
            revalidatePath("/projects");
        }
    } catch (error) {
        console.log(error);
    }
}

//- - - - - -  Stages functions - - - - - - -

export async function createStage(data: addStage, userId: string[]) {
    try {
        console.log(data)
        const newStage = await prisma.stage.create({
            data: {
                name: data.name,
                docType: data.docType,
                project: { connect: { id: parseInt(data.projectId) } },
                docUrl: data.docUrl,
                stageUsers: {
                    create: userId.map((userId) => ({ userId }))
                }
            }
        });
        if (newStage) {
            revalidatePath("/projects");
            return { stageId: newStage.id };
        }
    } catch (error) {
        console.log(error);
    }
}
//Edit stage
export async function editStageFunction(
    id: string,
    data: editStage,
    userIds: string[]
) {
    try {
        // Get users already relates to the stage
        const existingStageUsers = await prisma.stageUsers.findMany({
            where : { stageId: id },
            select: { userId: true }
        });

        const existingUserIds = existingStageUsers.map((user) => user.userId);

        // Users to add and to remove
        const usersToAdd = userIds.filter(
            (userId) => !existingUserIds.includes(userId)
        );
        const usersToRemove = existingUserIds.filter(
            (userId) => !userIds.includes(userId)
        );

        // Update stage
        const updatedStage = await prisma.stage.update({
            where: { id },
            data: {
                name: data.name,

                docType: data.docType,
                stageUsers: {
                    create: usersToAdd.map((userId) => ({ userId })),
                    deleteMany: usersToRemove.map((userId) => ({ userId, stageId: id }))
                }
            }
        });


        if (updatedStage) {
            revalidatePath("/projects");
        }
    } catch (error) {
        console.log(error);
    }
}

//Update Status

export async function updateStageStatusFunction(
    id: string,
    statusUpdate: string
) {
    try {
        const newStage = await prisma.stage.update({
            where: { id },
            data: { status: statusUpdate }
        });
        if (newStage) {
            revalidatePath("/projects");
            console.log("Stage status updated");
        }
    } catch (error) {
        console.log(error);
    }
}



export async function deleteStage(id: string) {
    try {
        // await prisma.timeLog.deleteMany({ where: { stageId: id } });
        // await prisma.stageUsers.deleteMany({ where: { stageId: id } });

        const deletedStage = await prisma.stage.delete({
            where: { id }
        });

        if (deletedStage) {
            // TODO: Add Success Notifications
            revalidatePath("/projects");
        }
    } catch (error) {
        // TODO: Add Error Notifications
        console.error("Error deleting project:", error);
    }
}

//- - - - - -  Users functions - - - - - - -

export async function fetchUsers() {
    try {
        return await prisma.user.findMany();
    } catch (error) {
        console.error("Failed to fetch projects", error);
        return [];
    }
}

export async function getUserById(id: string) {
    try {
        return await prisma.user.findUnique({ where: { id } });
    } catch (error) {
        console.error("Get user by id error:", error);
    }
}


// - - - - - -  QA functions - - - - - - -
export async function fetchClientQAs(clientId: string) {
    try {
        const qas = await prisma.qA.findMany({
            where: { 
                clientId: parseInt(clientId) 
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
        return qas;
    } catch (error) {
        console.error("Failed to fetch QAs:", error);
        return [];
    }
}

export async function deleteQA(id: string) {
    try {
        const deletedQA = await prisma.qA.delete({
            where: { id: parseInt(id) }
        });

        if (deletedQA) {
            revalidatePath("/projects");
            return { success: true };
        }
    } catch (error) {
        console.error("Failed to delete QA:", error);
        return { success: false };
    }
}
// - - - - - -  Website functions - - - - - - -

export async function fetchSiteByClientId(clientId: string): Promise<WebsiteData | null> {
    try {
        // await prisma.website.deleteMany();

        const site = await prisma.website.findUnique({
            where: { clientId: parseInt(clientId) }
        });
        // @ts-ignore
        return site;
    } catch (error) {
        console.error("Failed to fetch site:", error);
        return null;
    }
}