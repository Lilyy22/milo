import { prisma } from '@/lib/prisma'

export const getStages = async () => {
    return await prisma.stage.findMany()
  }
  
  export const getStageById = async (id: string) => {
    return await prisma.stage.findUnique({
      where: { id }
    })
  }
  
  export const createStage = async (data: {
    name: string
    planHours: number
    active: boolean
    report: string
    plannedDue: Date
    factFinished: Date
    projectId: string
  }) => {
    return await prisma.stage.create({
      data: {
        ...data,
        docType: 'STAGE', // Assuming 'STAGE' is the correct docType for stages
        project: {
          connect: { id: parseInt(data.projectId) }
        }
      }
    })
  }
  
  export const updateStage = async (id: string, data: Partial<{
    name: string
    planHours: number
    active: boolean
    report: string
    plannedDue: Date
    factFinished: Date
  }>) => {
    return await prisma.stage.update({
      where: { id },
      data
    })
  }
  
  export const deleteStage = async (id: string) => {
    return await prisma.stage.delete({
      where: { id }
    })
  }
  