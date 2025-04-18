import { Octokit } from "@octokit/rest";
import simpleGit, { CleanOptions, ResetMode, SimpleGit } from "simple-git";
import fs from "fs-extra";
import path from "path";
import { UpdateWebsiteDataType } from "@/schemas/update-website";

class GitHubClient {
  private octokit: Octokit;
  private readonly DEFAULT_BRANCH: string = "main";
  private readonly BOT_NAME: string = "Reputation Rhino Bot";
  private readonly BOT_EMAIL: string = "bot@reputation-rhino.com";

  constructor(
    private readonly githubToken: string = process.env.GITHUB_TOKEN!
  ) {
    this.octokit = new Octokit({
      auth: this.githubToken,
    });
  }

  private async initGit(git: SimpleGit): Promise<void> {
    await git.init();
    await git.addConfig("user.name", this.BOT_NAME, false, "local");
    await git.addConfig("user.email", this.BOT_EMAIL, false, "local");
  }

  public async createRepository(repositoryName: string, description: string) {
    try {
      const { data: repository } =
        await this.octokit.repos.createForAuthenticatedUser({
          name: repositoryName,
          description,
          private: true,
          auto_init: false,
        });

      console.log(`Repository created: ${repository.html_url}`);
      return {
        repositoryUrl: repository.html_url,
        cloneUrl: repository.clone_url,
      };
    } catch (error) {
      console.error("Error creating GitHub repository:", error);
      throw new Error(
        `Failed to create GitHub repository: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private async initGitAndPush(directory: string, repositoryUrl: string) {
    const repoUrlWithToken = repositoryUrl.replace(
      "https://",
      `https://x-access-token:${this.githubToken}@`
    );

    try {
      const git = simpleGit(directory);

      await this.initGit(git);

      await git.add(".");
      await git.commit("Initial website deployment");

      await git.raw(["remote", "remove", "origin"]).catch(() => {});

      await git.addRemote("origin", repoUrlWithToken);

      await git
        .raw(["branch", "-M", this.DEFAULT_BRANCH])
        .catch(() => git.checkoutLocalBranch(this.DEFAULT_BRANCH));

      await git.push("origin", this.DEFAULT_BRANCH, ["--force"]);

      console.log(`Website successfully deployed to ${repositoryUrl}`);
    } catch (error) {
      console.error("Error during Git operations:", error);
      throw new Error(
        `Git operations failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  public async deployWebsite(websiteDir: string, repositoryUrl: string) {
    try {
      console.log(
        `Deploying website from ${websiteDir} to GitHub repository: ${repositoryUrl}`
      );

      const gitDir = path.join(websiteDir, ".git");
      if (await fs.pathExists(gitDir)) {
        console.log(`Removing existing .git directory at ${gitDir}`);
        await fs.remove(gitDir);
      }

      await this.initGitAndPush(websiteDir, repositoryUrl);

      return repositoryUrl;
    } catch (error) {
      console.error("Error deploying to GitHub:", error);
      throw new Error(
        `Failed to deploy to GitHub: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private async checkFileNeedsUpdate({
    owner,
    repoName,
    filePath,
    newContent,
  }: CheckFileNeedsUpdateParams) {
    try {
      const { data: existingFile } = await this.octokit.repos.getContent({
        owner,
        repo: repoName,
        path: filePath,
      });

      if (!Array.isArray(existingFile) && existingFile.type === "file") {
        const sha = existingFile.sha;
        const fileContent = existingFile as { content: string };
        const existingContent = Buffer.from(
          fileContent.content,
          "base64"
        ).toString("utf8");

        return {
          needsUpdate: existingContent.trim() !== newContent.trim(),
          sha,
        };
      }
    } catch (error) {
      console.log(`File ${filePath} not found, will create a new one`);
    }

    return { needsUpdate: true };
  }

  private async updateFileInRepository({
    owner,
    repoName,
    filePath,
    content,
    commitMessage,
    sha,
  }: UpdateFileInRepositoryParams) {
    await this.octokit.repos.createOrUpdateFileContents({
      owner,
      repo: repoName,
      path: filePath,
      message: commitMessage,
      content: Buffer.from(content).toString("base64"),
      sha,
      branch: this.DEFAULT_BRANCH,
      committer: {
        name: this.BOT_NAME,
        email: this.BOT_EMAIL,
      },
      author: {
        name: this.BOT_NAME,
        email: this.BOT_EMAIL,
      },
    });

    console.log(
      `File ${filePath} ${
        sha ? "updated" : "created"
      } in repository ${owner}/${repoName}`
    );
  }

  // public async updateRepository({
  //   websiteDir,
  //   repositoryUrl,
  // }: {
  //   websiteDir: string;
  //   repositoryUrl: string;
  // }) {
  //   try {
  //     // Create temporary directory for git operations
  //     const tempGitDir = path.join(process.cwd(), ".temp-git-" + Date.now());
  //     await fs.ensureDir(tempGitDir);

  //     try {
  //       // Clone the repository
  //       const repoUrlWithToken = repositoryUrl.replace(
  //         "https://",
  //         `https://x-access-token:${this.githubToken}@`
  //       );
  //       const git = simpleGit(tempGitDir);
  //       await git.clone(repoUrlWithToken, ".");

  //       // Ensure src directory exists
  //       const srcDir = path.join(tempGitDir, "src");
  //       await fs.ensureDir(srcDir);

  //       // Remove entire src/app and src/constants directories
  //       // await fs.remove(path.join(srcDir, "app"));
  //       // await fs.remove(path.join(srcDir, "constants"));
  //       await fs.remove(srcDir);

  //       // Copy new directories from generated website
  //       await fs.copy(websiteDir, tempGitDir);
  //       // await fs.copy(
  //       //   path.join(websiteDir, "src", "constants"),
  //       //   path.join(srcDir, "constants")
  //       // );
  //       // await fs.copy(
  //       //   path.join(websiteDir, "src", "app"),
  //       //   path.join(srcDir, "app")
  //       // );

  //       // Git operations
  //       await this.initGit(git);

  //       // Stage all changes, including deletions
  //       await git.add(".");

  //       // Check if there are any changes to commit
  //       const status = await git.status();

  //       if (!status.isClean()) {
  //         await git.commit("Update website content and configuration");
  //         await git.push("origin", this.DEFAULT_BRANCH);
  //         console.log(
  //           `Successfully updated src/app and src/constants in repository ${repositoryUrl}`
  //         );
  //       } else {
  //         console.log("No changes detected in the repository");
  //       }

  //       return repositoryUrl;
  //     } finally {
  //       if (await fs.pathExists(tempGitDir)) {
  //         await fs.remove(tempGitDir);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error updating GitHub repository:", error);
  //     throw new Error(
  //       `Failed to update GitHub repository: ${
  //         error instanceof Error ? error.message : "Unknown error"
  //       }`
  //     );
  //   }
  // }

  public async updateRepository({
    websiteDir,
    repositoryUrl,
  }: {
    websiteDir: string;
    repositoryUrl: string;
  }) {
    try {
      // Create temporary directory for git operations
      const tempGitDir = path.join(process.cwd(), ".temp-git-" + Date.now());
      await fs.ensureDir(tempGitDir);

      try {
        // Clone the repository
        const repoUrlWithToken = repositoryUrl.replace(
          "https://",
          `https://x-access-token:${this.githubToken}@`
        );
        const git = simpleGit(tempGitDir);
        await git.clone(repoUrlWithToken, ".");

        // Clean up untracked files and directories
        await git.clean([CleanOptions.FORCE, CleanOptions.RECURSIVE]);

        // Reset the branch to the latest commit to discard any changes
        await git.reset(ResetMode.HARD);

        // Remove all files except .git directory
        const allFiles = await fs.readdir(tempGitDir);
        for (const file of allFiles) {
          if (!(file === ".git" || file.startsWith(".git/"))) {
            const filePath = path.join(tempGitDir, file);
            await fs.remove(filePath);
          }
        }

        // Copy new template files
        await fs.copy(websiteDir, tempGitDir);

        // Reinitialize Git and stage all changes
        await this.initGit(git);

        // Stage all changes, including deletions
        await git.add(".");

        // Check if there are any changes to commit
        const status = await git.status();
        if (!status.isClean()) {
          await git.commit("Update website content and configuration");
          await git.push("origin", this.DEFAULT_BRANCH, ["--force"]); // Force push to overwrite history
          console.log(
            `Successfully updated repository ${repositoryUrl} with new template`
          );
        } else {
          console.log("No changes detected in the repository");
        }

        return repositoryUrl;
      } finally {
        // Clean up temporary directory
        if (await fs.pathExists(tempGitDir)) {
          await fs.remove(tempGitDir);
        }
      }
    } catch (error) {
      console.error("Error updating GitHub repository:", error);
      throw new Error(
        `Failed to update GitHub repository: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  public async cloneRepository(
    repositoryUrl: string,
    targetDir: string
  ): Promise<string> {
    try {
      console.log(`Cloning repository ${repositoryUrl} to ${targetDir}`);

      // Remove directory if it already exists
      if (await fs.pathExists(targetDir)) {
        console.log(`Removing existing directory at ${targetDir}`);
        await fs.remove(targetDir);
      }

      await fs.ensureDir(targetDir);

      const repoUrlWithToken = repositoryUrl.replace(
        "https://",
        `https://x-access-token:${this.githubToken}@`
      );

      const git = simpleGit();
      await git.clone(repoUrlWithToken, targetDir);

      const gitDir = path.join(targetDir, ".git");
      if (await fs.pathExists(gitDir)) await fs.remove(gitDir);

      console.log(`Repository successfully cloned to ${targetDir}`);
      return targetDir;
    } catch (error) {
      console.error("Error cloning repository:", error);
      throw new Error(
        `Failed to clone repository: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

type UpdateRepositoryParams = {
  websiteData: UpdateWebsiteDataType;
  websiteId: string;
  repositoryUrl: string;
};

type UpdateFileInRepositoryParams = {
  owner: string;
  repoName: string;
  filePath: string;
  content: string;
  commitMessage: string;
  sha?: string;
};

type CheckFileNeedsUpdateParams = {
  owner: string;
  repoName: string;
  filePath: string;
  newContent: string;
};
export default new GitHubClient(process.env.GITHUB_TOKEN);
