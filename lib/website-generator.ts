import fs from "fs-extra";
import path from "node:path";
import { PAGES_NAVIGATION, SOCIAL_LINKS } from "@/constants/website";
import { CreateWebsiteDataType } from "@/schemas/create-website";

interface PageConfig {
    name: string;
    route: string;
}

const TEMPLATE_DIR = path.join(process.cwd(), "template");
const FOR_WEBSITES_DIR = path.join(process.cwd(), "for-websites");
const NEW_WEBSITES_DIR = path.join(process.cwd(), "new-websites");

const pageConfigs: Record<string, PageConfig> = {
    "/home": { name: "Home", route: "home" },
    "/about": { name: "About", route: "about" },
    "/contact": { name: "Contact", route: "contact" },
    "/blog": { name: "Blog", route: "blog" },
    "/news": { name: "News", route: "news" },
};

export class WebsiteGenerator {
    constructor() {}

    async createConstantsFile(websiteData: CreateWebsiteDataType, websiteId: string): Promise<string> {
        const { pages, homePageContent, aboutPageContent } = websiteData;

        const navigationLinks = pages.map(page => ({
            href: page,
            label: PAGES_NAVIGATION[page as keyof typeof PAGES_NAVIGATION].label,
        }));

        const newFileContent = `
export const NAVIGATION_LINKS = ${JSON.stringify(navigationLinks, null, 2)};

export const SOCIAL_LINKS = ${JSON.stringify(SOCIAL_LINKS, null, 2)};

export const HOME_PAGE_CONTENT = ${JSON.stringify(homePageContent, null, 2)};

export const ABOUT_PAGE_CONTENT = ${JSON.stringify(aboutPageContent, null, 2)};`;

        await fs.ensureDir(FOR_WEBSITES_DIR);

        const constantsPath = path.join(FOR_WEBSITES_DIR, `constants_${websiteId}_${Date.now()}.js`);
        await fs.writeFile(constantsPath, newFileContent, "utf8");
        return constantsPath;
    }

    async generateLayoutFile(websiteData: CreateWebsiteDataType, websiteId: string): Promise<string> {
        const layoutSourcePath = path.join(TEMPLATE_DIR, "src/app/layout.js");
        let layoutContent = await fs.readFile(layoutSourcePath, "utf8");

        const metadataContent = `export const metadata = {
    title: "${websiteData.siteName}",
    description: "${websiteData.description}",
    ${websiteData.searchConsoleId ? `,
    verification: {
        google: "${websiteData.searchConsoleId}"
    }` : ""}
};`;

        layoutContent = layoutContent.replace("{content}", metadataContent);

        if (websiteData.googleAnalyticsId) {
            const googleAnalyticsComponent = `<GoogleAnalytics gaId="${websiteData.googleAnalyticsId}" />`;
            layoutContent = layoutContent.replace("{googleAnalytics}", googleAnalyticsComponent);
        } else {
            layoutContent = layoutContent.replace("{googleAnalytics}", "");
        }

        await fs.ensureDir(FOR_WEBSITES_DIR);

        const newLayoutPath = path.join(FOR_WEBSITES_DIR, `layout_${websiteId}_${Date.now()}.js`);
        await fs.writeFile(newLayoutPath, layoutContent, "utf8");
        return newLayoutPath;
    }

    async generateWebsite(websiteData: CreateWebsiteDataType, websiteId: string) {
        console.log("Starting website generation process...");

        const createdWebsiteDir = path.join(NEW_WEBSITES_DIR, `website_${websiteId}_${Date.now()}`);
        await fs.ensureDir(createdWebsiteDir);

        console.log(`Copying template from ${TEMPLATE_DIR} to ${createdWebsiteDir}`);
        await this.copyTemplate(createdWebsiteDir);

        const tempConstantsPath = await this.createConstantsFile(websiteData, websiteId);
        await this.replaceConstantsFile(tempConstantsPath, createdWebsiteDir);

        const tempLayoutPath = await this.generateLayoutFile(websiteData, websiteId);
        await this.replaceLayoutFile(tempLayoutPath, createdWebsiteDir);

        await this.createPages(websiteData.pages, createdWebsiteDir);

        console.log(`Website generated successfully at: ${createdWebsiteDir}`);
        return {
            newWebsiteDir: createdWebsiteDir,
            newConstantsPath: tempConstantsPath,
            newLayoutPath: tempLayoutPath,
        };
    }

    private async copyTemplate(createdWebsiteDir: string): Promise<void> {
        if (!(await fs.pathExists(TEMPLATE_DIR))) throw new Error(`Template directory does not exist: ${TEMPLATE_DIR}`);

        await fs.copy(TEMPLATE_DIR, createdWebsiteDir);
        console.log("Template copied successfully");
    }

    private async replaceConstantsFile(tempConstantsPath: string, createdWebsiteDir: string): Promise<void> {
        const destConstantsPath = path.join(createdWebsiteDir, "src/constants/index.js");
        await fs.copy(tempConstantsPath, destConstantsPath, { overwrite: true });
    }

    private async replaceLayoutFile(tempLayoutPath: string, createdWebsiteDir: string): Promise<void> {
        const destLayoutPath = path.join(createdWebsiteDir, "src/app/layout.js");
        await fs.copy(tempLayoutPath, destLayoutPath, { overwrite: true });
    }

    private async createPages(pages: string[], createdWebsiteDir: string): Promise<void> {
        try {
            for (const page of pages) {
                const pageConfig = pageConfigs[page];

                if (!pageConfig) {
                    console.warn(`Unknown page type: ${page}, skipping`);
                    continue;
                }

                const pageDir = path.join(createdWebsiteDir, "src/app", pageConfig.route);
                await fs.ensureDir(pageDir);

                const componentName = page.replace(/\//g, "").toLowerCase();

                const pageContent = `import React from 'react';
import Page from '@/components/${componentName}/page';

export default function ${pageConfig.name}Page() {
  return <Page />;
}`;

                const pageFilePath = path.join(pageDir, "page.js");
                await fs.writeFile(pageFilePath, pageContent);
            }
        } catch (error) {
            console.error("Error creating pages:", error);
            throw error;
        }
    }

    async cleanup({
        constantsPath,
        websitePath,
        websiteArchivePath,
        layoutPath,
    }: {
        constantsPath?: string;
        websitePath?: string;
        websiteArchivePath?: string;
        layoutPath?: string;
    }): Promise<void> {
        try {
            if (constantsPath && (await fs.pathExists(constantsPath))) await fs.remove(constantsPath);
            if (websitePath && (await fs.pathExists(websitePath))) await fs.remove(websitePath);
            if (websiteArchivePath && (await fs.pathExists(websiteArchivePath))) await fs.remove(websiteArchivePath);
            if (layoutPath && (await fs.pathExists(layoutPath))) await fs.remove(layoutPath);
            console.log("Temporary files successfully deleted");
        } catch (error) {
            console.error("Error deleting temporary files:", error);
        }
    }
}

export default new WebsiteGenerator();
