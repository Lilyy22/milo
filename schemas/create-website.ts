import { z } from "zod";

export const socialLinksSchema = z.object({
  x: z.string().min(1, "X link is required"),
  facebook: z.string().min(1, "Facebook link is required"),
  linkedin: z.string().min(1, "Linkedin link is required"),
});

export const pagesSchema = z.array(
  z
    .string()
    .refine(
      (val) => ["/home", "/about", "/blog", "/news", "/contact"].includes(val),
      {
        message: "Invalid page type",
      }
    )
);

export const homePageContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  heroBlock: z
    .object({
      title: z.string().min(1, "Hero block title is required"),
      subtitle: z.string().min(1, "Hero block subtitle is required"),
    })
    .optional(),
  mainBlock: z.object({
    title: z.string().min(1, "Main block title is required"),
    text: z.string().min(1, "Main block text is required"),
  }),
  keysBlock: z.object({
    title: z.string().min(1, "Keys block title is required"),
    items: z
      .array(z.string().min(1, "Item name is required"))
      .min(1, "At least one key item is required"),
    footer: z.string().min(1, "Footer is required"),
  }),
  whyChooseBlock: z
    .object({
      title: z.string().min(1, "Why chooose us section title is required"),
      subtitle: z
        .string()
        .min(1, "Why chooose us section subtitle is required"),
      items: z
        .array(z.string().min(1, "Item name is required"))
        .min(1, "At least one key item is required"),
    })
    .optional(),
  statBlock: z
    .object({
      title: z.string().min(1, "Stat title is required"),
      items: z
        .array(
          z.object({
            total: z.number().min(0, "Total no of experince in years"),
            text: z.string().min(1, "Text is required"),
          })
        )
        .min(1, "At least one key item is required"),
    })
    .optional(),
});

export const aboutPageContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  mainBlock: z.object({
    title: z.string().min(1, "Main block title is required"),
    text: z.string().min(1, "Main block text is required"),
  }),
  keysBlock: z.object({
    title: z.string().min(1, "Keys block title is required"),
    items: z
      .array(
        z.object({
          name: z.string().min(1, "Item name is required"),
          description: z.string().min(1, "Item description is required"),
        })
      )
      .min(1, "At least one key item is required"),
    footer: z.string().min(1, "Footer is required"),
  }),
  footer: z.string().min(1, "Footer is required"),
});

const createWebsiteDataSchema = z.object({
  // domain: z.string().min(1, "Domain is required").nullable(),
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

export const createRequestSchema = z.object({
  clientId: z.number().int().positive("Client ID must be a positive integer"),
  websiteData: createWebsiteDataSchema,
});

export type CreateWebsiteDataType = z.infer<typeof createWebsiteDataSchema>;
export type CreateRequestDataType = z.infer<typeof createRequestSchema>;
