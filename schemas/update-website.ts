import { z } from "zod";
import {
  homePageContentSchema,
  aboutPageContentSchema,
  socialLinksSchema,
  pagesSchema,
} from "./create-website";

export const updateWebsiteDataSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  description: z.string().min(1, "Description is required"),

  pages: pagesSchema.min(1, "At least one page is required"),
  template: z.enum(["BASIC", "ELITE"]),

  googleAnalyticsId: z.string().optional(),
  searchConsoleId: z.string().optional(),

  homePageContent: homePageContentSchema,
  aboutPageContent: aboutPageContentSchema,
  blogPageContent: z.string().optional().nullable(),
  newsPageContent: z.string().optional().nullable(),
  contactPageContent: z.string().optional().nullable(),

  socialLinks: socialLinksSchema,
  assets: z.any(),

  isPublished: z.boolean(),
});

export const updateRequestSchema = z.object({
  clientId: z.number().int().positive("Client ID must be a positive integer"),
  websiteData: updateWebsiteDataSchema,
});

export type UpdateWebsiteDataType = z.infer<typeof updateWebsiteDataSchema>;
export type UpdateRequestDataType = z.infer<typeof updateRequestSchema>;
