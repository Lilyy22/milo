import { CreateWebsiteDataType } from "@/schemas/create-website";
import { UpdateWebsiteDataType } from "@/schemas/update-website";

export async function generateWebsiteContent(clientId: number, pages: string[]) {
    try {
        const response = await fetch(`/api/website/generate-content`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clientId, pages }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            errorData.message = errorData.error || "Failed to generate content. Please try again.";
            throw new Error(errorData.message);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error generating content:", error);
        throw error;
    }
}

export async function createWebsite(clientId: number, websiteData: CreateWebsiteDataType & Record<string, any>) {
    try {
        const response = await fetch(`/api/website/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clientId, websiteData }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            errorData.message = errorData.error || "Failed to save website. Please try again.";
            throw new Error(errorData.message);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating website:", error);
        throw error;
    }
}

export async function updateWebsite(clientId: number, websiteData: UpdateWebsiteDataType & Record<string, any>) {
    try {
        const response = await fetch(`/api/website/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clientId, websiteData }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            errorData.message = errorData.error || "Failed to update website. Please try again.";
            throw new Error(errorData.message);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating website:", error);
        throw error;
    }
}
