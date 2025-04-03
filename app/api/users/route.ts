import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/app/types";

// Create user
export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const user = await prisma.user.create({
            data
        });
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Get by id
    if (id) {
        try {
            const user = await prisma.user.findUnique({
                where: { id }
            });

            if (!user) {
                return NextResponse.json(
                    { error: "User not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json(user, { status: 200 });
        } catch (error) {
            return NextResponse.json(
                { error: "Failed to fetch user" },
                { status: 500 }
            );
        }
    }
    else {
        // Get all
        try {
            const users = await prisma.user.findMany();
            return NextResponse.json(users, { status: 200 });
        } catch (error) {
            return NextResponse.json(
                { error: "Failed to fetch users" },
                { status: 500 }
            );
        }
    }
}

// Update user
export async function PUT(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id") as string | undefined;
    const data: Partial<{
        email: string;
        name?: string;
        avatar?: string;
        role?: UserRole;
    }> = await req.json();

    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data
        });

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
        );
    }
}

// Delete user
export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id") as string | undefined;

    try {
        await prisma.user.delete({
            where: { id }
        });

        return NextResponse.json({ message: "User deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete user" },
            { status: 500 }
        );
    }
}
