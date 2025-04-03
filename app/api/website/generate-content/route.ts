import { NextResponse } from "next/server";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { openai } from "@/lib/openai";
import { AI_PROMPTS } from "@/constants/website";
import { getClientById } from "@/app/actions";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/auth";
import { homePageContentSchema, aboutPageContentSchema, postRequestSchema, ClientDataType } from "@/schemas/generate-content";

class ContentGenerator {
    private readonly promptBuilders: Record<string, { additionalSystemPrompt: string; schema: z.ZodType<any> }>;
    private readonly basePrompt: string;

    constructor() {
        this.promptBuilders = {
            home: this.buildHomePrompt(),
            about: this.buildAboutPrompt(),
            blog: this.buildBlogPrompt(),
            news: this.buildServicesPrompt(),
            contact: this.buildContactPrompt(),
        };
        this.basePrompt = AI_PROMPTS.MAIN;

        this.generateAiResponse = this.generateAiResponse.bind(this);
    }

    async generateAiResponse(clientData: ClientDataType, page: string): Promise<any> {
        try {
            const { additionalSystemPrompt, schema } = this.promptBuilders[page as keyof typeof this.promptBuilders];
            const systemPrompt = `${this.basePrompt}\n\n${additionalSystemPrompt}`;

            const userPrompt = `Biography: ${clientData.bio}`;

            const messages = [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ];

            const completion = await openai.beta.chat.completions.parse({
                model: "gpt-4o",
                messages: messages as ChatCompletionMessageParam[],
                temperature: 0.05,
                response_format: zodResponseFormat(schema, `${page}_content`),
                stream: false,
            });

            const content = completion.choices[0].message.parsed;
            if (!content) throw new Error("Failed to generate content.");

            return content;
        } catch (error) {
            console.error("OpenAI API error:", error);
            throw new Error("Failed to generate content.");
        }
    }

    private buildHomePrompt(): { additionalSystemPrompt: string; schema: z.ZodType<any> } {
        return { additionalSystemPrompt: AI_PROMPTS.HOME_PAGE, schema: homePageContentSchema };
    }

    private buildAboutPrompt(): { additionalSystemPrompt: string; schema: z.ZodType<any> } {
        return { additionalSystemPrompt: AI_PROMPTS.ABOUT_PAGE, schema: aboutPageContentSchema };
    }

    private buildBlogPrompt(): { additionalSystemPrompt: string; schema: z.ZodType<any> } {
        return { additionalSystemPrompt: AI_PROMPTS.BLOG_PAGE, schema: z.string().describe("Blog page content") };
    }

    private buildServicesPrompt(): { additionalSystemPrompt: string; schema: z.ZodType<any> } {
        return { additionalSystemPrompt: AI_PROMPTS.NEWS_PAGE, schema: z.string().describe("Services/news page content") };
    }

    private buildContactPrompt(): { additionalSystemPrompt: string; schema: z.ZodType<any> } {
        return {
            additionalSystemPrompt: "Create a contact page section with content about how to get in touch.",
            schema: z.string().describe("Contact page content"),
        };
    }
}

const contentGenerator = new ContentGenerator();

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOption);
        if (!session?.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

        const body = await req.json();
        const validationResult = postRequestSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json({ error: "Validation error", details: validationResult.error.format() }, { status: 400 });
        }

        const { clientId, pages } = validationResult.data;

        const clientData = await getClientById(clientId);
        if (!clientData || !clientData.bio || typeof clientData.bio !== "string") {
            return NextResponse.json({ error: "Invalid client data: biography is required" }, { status: 400 });
        }

        // Generate content for all requested page types concurrently
        const contentPromises = pages.map(p => {
            const page = p.replace("/", "");
            return contentGenerator
                .generateAiResponse(clientData, page)
                .then(content => ({ page, content }))
                .catch(error => {
                    console.error(`Error generating content for ${page}:`, error);
                    return null;
                });
        });

        const results = await Promise.all(contentPromises);

        // Organize results into a map of pageType -> content
        const content = results.reduce((acc, result) => {
            if (result) acc[result.page] = result.content;
            return acc;
        }, {} as Record<string, any>);

        // Check if we have any successful generations
        if (Object.keys(content).length === 0) {
            return NextResponse.json({ error: "Failed to generate content for any of the requested pages" }, { status: 500 });
        }

        return NextResponse.json(content);
    } catch (error: any) {
        console.error("Error generating content:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
