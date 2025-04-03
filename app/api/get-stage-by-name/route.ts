import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');

    if (name) {
        try {
            // Query the stage model by name
            const stage = await prisma.stage.findFirst({
                where: { name },
                include: { project: true }, // Include related clientData if needed
            });
            if (stage) {
                return NextResponse.json(stage, { status: 200 });
            } else {
                return NextResponse.json({ error: 'Stage not found' }, { status: 404 });
            }
        } catch (error) {
            console.error('Error fetching stage by name:', error);
            return NextResponse.json({ error: 'Failed to fetch stage' }, { status: 500 });
        }
    } else {
        return NextResponse.json({ error: 'Name parameter is required' }, { status: 400 });
    }
}