import { Vercel } from "@vercel/sdk";

class VercelSDK {
    private vercel: Vercel;

    constructor(private readonly token: string, private readonly teamId: string) {
        this.vercel = new Vercel({
            bearerToken: this.token,
        });
    }

    private getGitHubInfo(repositoryUrl: string) {
        const githubUsername = repositoryUrl.split("/")[3];
        const repositoryName = repositoryUrl.split("/")[4];
        return { githubUsername, repositoryName };
    }

    async createVercelProject(projectName: string, repositoryUrl: string) {
        const { githubUsername, repositoryName } = this.getGitHubInfo(repositoryUrl);

        try {
            const result = await this.vercel.projects.getProjects({ repoUrl: repositoryUrl });
            if (result.projects?.length > 0) return result.projects[0];

            console.log(`Creating new Vercel project: ${projectName}`);

            const project = await this.vercel.projects.createProject({
                requestBody: {
                    name: projectName,
                    framework: "nextjs",
                    gitRepository: {
                        repo: `${githubUsername}/${repositoryName}`,
                        type: "github",
                    },
                },
            });

            console.log(`Project created: ${project.name} with ID ${project.id}`);
            return project;
        } catch (error) {
            console.error("Failed to create Vercel project:", error);
            throw error;
        }
    }

    async deployToVercel({ repositoryUrl, projectName }: DeploymentOptions) {
        const { githubUsername, repositoryName } = this.getGitHubInfo(repositoryUrl);

        try {
            const project = await this.createVercelProject(projectName, repositoryUrl);
            const deployment = await this.vercel.deployments.createDeployment({
                requestBody: {
                    name: projectName,
                    target: "production",
                    gitSource: {
                        type: "github",
                        ref: "main",
                        repo: repositoryName,
                        org: githubUsername,
                    },
                },
            });

            console.log(`Deployment created: ID ${deployment.id} with status ${deployment.status}`);

            return { vercelProjectId: project.id, vercelDeploymentId: deployment.id, status: deployment.status };
        } catch (error) {
            console.error("Failed to deploy to Vercel:", error);
            throw error;
        }
    }

    async checkDeploymentStatus(deploymentId: string) {
        try {
            const deployment = await this.vercel.deployments.getDeployment({
                idOrUrl: deploymentId,
                withGitRepoInfo: "true",
            });

            return { deploymentId: deployment.id, status: deployment.status, url: deployment.url };
        } catch (error) {
            console.error("Failed to check deployment status:", error);
            throw error;
        }
    }

    async waitForDeployment(deploymentId: string, maxAttempts = 20, interval = 5000) {
        let attempts = 0;

        while (attempts < maxAttempts) {
            const result = await this.checkDeploymentStatus(deploymentId);

            if (result.status === "READY") {
                return { success: true, url: result.url, deploymentId: result.deploymentId };
            }

            if (result.status === "ERROR") {
                return { success: false, error: "Deployment failed", deploymentId: result.deploymentId };
            }

            await new Promise(resolve => setTimeout(resolve, interval));
            attempts++;
        }

        return { success: false, error: "Timeout waiting for deployment", deploymentId };
    }
}

export default new VercelSDK(process.env.VERCEL_TOKEN!, process.env.VERCEL_TEAM_ID!);

type DeploymentOptions = {
    repositoryUrl: string;
    projectName: string;
};
