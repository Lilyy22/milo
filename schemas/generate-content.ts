import { z } from "zod";
import { pagesSchema } from "./create-website";
const homePageContentSchema = z
    .object({
        title: z.string().describe("Catchy headline that captures the essence of the person/brand (5-10 words)"),
        mainBlock: z.object({
            title: z.string().describe("Main section headline (can be same as page title)"),
            text: z
                .string()
                .describe("Compelling introduction paragraph about the individual's expertise and value proposition (150-250 words)"),
        }),
        keysBlock: z.object({
            title: z.string().describe("Section headline for key expertise/services (max 5 words)"),
            items: z
                .array(z.string())
                .describe("3-5 bullet points highlighting key expertise areas Each bullet point should be 10-15 words."),
            footer: z.string().describe("Short concluding sentence encouraging further exploration (15-30 words)"),
        }),
        footer: z.string().describe("Final call-to-action statement (max 10 words)"),
    })
    .describe("Home page content about a person/brand in structured JSON format");

const aboutPageContentSchema = z
    .object({
        title: z.string().describe("Catchy headline that captures professional titles and expertise areas (5-10 words)"),
        mainBlock: z.object({
            title: z.string().describe("Main section headline for the about page (For example: 'More About Me')"),
            text: z.string().describe("Detailed professional biography and background (200-300 words)"),
        }),
        keysBlock: z.object({
            title: z.string().describe("Section headline for values or approach (For example: 'Core Values & Approach')"),
            items: z
                .array(
                    z.object({
                        name: z.string().describe("Name of the value or approach principle (For example: 'Integrity')"),
                        description: z
                            .string()
                            .describe(
                                "Brief description of the value or approach (For example: 'Every case is handled with the highest ethical standards.')",
                            ),
                    }),
                )
                .describe("3-5 core values or principles with descriptions"),
            footer: z.string().describe("Concluding paragraph about additional activities or interests (15-30 words)"),
        }),
        footer: z.string().describe("Final call-to-action statement (For example:'Ready to Discuss Your Legal Needs?')"),
    })
    .describe("About page content in structured JSON format");

const clientDataSchema = z.object({
    bio: z.string().describe("The individual's professional biography text"),
});

const postRequestSchema = z.object({
    clientId: z.number().int().positive("Client ID must be a positive integer"),
    pages: pagesSchema.min(1, "At least one page is required"),
});

export type ClientDataType = z.infer<typeof clientDataSchema>;

export { homePageContentSchema, aboutPageContentSchema, clientDataSchema, postRequestSchema };
