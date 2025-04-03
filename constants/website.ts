import { ClientData, TemplateType } from "@prisma/client";
import { WebsiteData } from "@/app/types";
import { CreateWebsiteDataType } from "@/schemas/create-website";
import { UpdateWebsiteDataType } from "@/schemas/update-website";

export const AI_PROMPTS = {
    MAIN: `You are an expert content strategist specializing in personal brand development and professional website content creation. Your role is to generate precise, structured content for personal professional websites.

Core Instructions:
- Generate content exclusively in the JSON structured format according to the provided schema
- Structure content logically with clear sections and hierarchy
- Create polished, professional-sounding content appropriate for a personal brand website
- Use a confident, authoritative tone suitable for professional positioning
- Write concise, impactful language that engages the reader
- Include appropriate calls-to-action where relevant
- Avoid fluff and generic statements
- Focus on specificity and relevance to the individual's field
- Maintain factual accuracy - do not invent credentials or experiences
- Adapt writing style to match the individual's industry and professional context

You will receive specific page instructions below, and a biography in the user message. Your goal is to transform this information into well-structured, professional website content that effectively positions the individual as an authority in their field.`,
    HOME_PAGE: `You need to generate engaging home page content for a personal brand website.

You will be provided with the individual's professional biography in the user message.

Your task:
- Create a compelling home page that serves as an introduction to the individual's personal brand
- Focus on creating a strong first impression that conveys professionalism and expertise
- Structure the content with a main headline, introductory paragraph, key expertise points, and call to action
- Extract the most impressive achievements and specializations from the biography
- Make the expertise points specific and relevant to the person's field
- Use professional, confident language appropriate for a personal brand website
- Keep tone authoritative but approachable`,
    ABOUT_PAGE: `You need to generate detailed about page content for a personal brand website.

You will be provided with the individual's professional biography in the user message.

Your task:
- Create content that tells the individual's professional story in a compelling way
- Structure the content with these sections:
  1. A title that highlights professional titles and areas of expertise
  2. A main biographical section with comprehensive background information
  3. A core values/approach section with 3-5 named principles and their descriptions
  4. A conclusion with a call to action
- The core values section should include items with both a name (like "Integrity" or "Innovation") AND a brief description for each
- Make sure each value reflects the individual's professional philosophy and approach
- Highlight education, credentials, and career milestones in the main text
- Include a footer paragraph in the keysBlock that mentions other professional activities (speaking, mentoring, writing, etc.)
- End with a compelling call-to-action in the footer
- Maintain a professional yet engaging tone throughout`,

    BLOG_PAGE: `You need to generate blog page content relevant to the individual's expertise.

You will be provided with the individual's professional biography in the user message.

Your task:
- Create content for a blog landing page that highlights the individual's thought leadership
- Focus on topics that demonstrate their expertise and knowledge
- Generate content that positions them as an authority in their industry`,

    NEWS_PAGE: `You need to generate services/news page content based on the individual's expertise.
You will be provided with the individual's professional biography in the user message.

Your task:
- Create content that effectively showcases the individual's professional services or latest news
- Focus on the value they provide to clients or their audience
- Highlight their unique approach or methodology
- Emphasize outcomes and benefits of their services or work`,
};

export const PAGES_NAVIGATION = {
    "/home": {
        label: "Home",
        value: "/home",
        isRequired: true,
    },
    "/about": {
        label: "About",
        value: "/about",
        isRequired: true,
    },
    "/blog": {
        label: "Blog",
        value: "/blog",
        isRequired: false,
    },
    "/news": {
        label: "In the News",
        value: "/news",
        isRequired: false,
    },
    "/contact": {
        label: "Contact",
        value: "/contact",
        isRequired: false,
    },
};

export const DEFAULT_WEBSITE_CONTENT = {
    siteName: "",
    description: "",

    pages: ["/home", "/about"],
    template: TemplateType.BASIC,

    googleAnalyticsId: "",
    searchConsoleId: "",

    homePageContent: {
        title: "",
        mainBlock: {
            title: "",
            text: "",
        },
        keysBlock: {
            title: "",
            items: [""],
            footer: "",
        },
        footer: "",
    },
    aboutPageContent: {
        title: "",
        mainBlock: {
            title: "",
            text: "",
        },
        keysBlock: {
            title: "",
            items: [
                {
                    name: "",
                    description: "",
                },
            ],
            footer: "",
        },
        footer: "",
    },
    blogPageContent: undefined,
    newsPageContent: undefined,

    githubRepositoryUrl: "",

    socialLinks: {
        x: "https://x.com/",
        facebook: "https://facebook.com/",
        linkedin: "https://www.linkedin.com/",
    },
    assets: {},

    isPublished: false,
};

export const SOCIAL_LINKS = [
    {
        id: "x",
        name: "X",
        url: "https://x.com/",
        alt: "X profile",
    },
    {
        id: "facebook",
        name: "Facebook",
        url: "https://facebook.com/",
        alt: "Facebook page",
    },
    {
        id: "linkedin",
        name: "LinkedIn",
        url: "https://linkedin.com/",
        alt: "LinkedIn profile",
    },
];

export const getDefaultCreateWebsiteData = (clientData: ClientData): CreateWebsiteDataType => {
    return {
        ...DEFAULT_WEBSITE_CONTENT,
        siteName: clientData.clientName,
        description: `This is a website about ${clientData.clientName}`,
    };
};

export const getDefaultUpdateWebsiteData = (websiteData: WebsiteData): UpdateWebsiteDataType => {
    return {
        siteName: websiteData.siteName,
        description: websiteData.description,
        pages: websiteData.pages,
        template: websiteData.template,
        googleAnalyticsId: websiteData.googleAnalyticsId,
        searchConsoleId: websiteData.searchConsoleId,
        homePageContent: websiteData.homePageContent,
        aboutPageContent: websiteData.aboutPageContent,
        blogPageContent: websiteData.blogPageContent,
        newsPageContent: websiteData.newsPageContent,
        contactPageContent: websiteData.contactPageContent,
        socialLinks: websiteData.socialLinks,
        assets: websiteData.assets,
        isPublished: websiteData.isPublished,
    };
};
