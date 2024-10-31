import { AddGitCommand } from "../commands/add-git-command";
import { CommitGitCommand } from "../commands/commit-git-command";
import { InitAndPushGitCommand } from "../commands/init-and-push-git-command";
import { PushGitCommand } from "../commands/push-git-command";
import { RepositoryNameGitCommand } from "../commands/repository-name-git-command";
import { PATH_GENERATION, PATH_TEMP_FILE } from "../constants";
import { ExecuteCloneOptions, GitCommitItem } from "../interfaces";
import { GitInvoker } from "../invokers/git-invoker";
import { GitRepository } from "../repositories/git-repository";
import { FileUtils } from "../utils/file";
import { generation } from "../utils/generation";

export class GitService {
  constructor(
    private readonly gitInvoker: GitInvoker,
    private readonly gitRepository: GitRepository
  ) {}

  public async initAndPushRepository(repository: string) {
    const initAndPushGitCommand = new InitAndPushGitCommand(repository);
    return initAndPushGitCommand.execute();
  }

  public async getAuthors(options: ExecuteCloneOptions) {
    return await this.gitRepository.getAuthors(options);
  }

  public async cloneCommits(options: ExecuteCloneOptions) {
    try {
      console.log("INICIA");
      const listLog = await this.gitRepository.getFilteredLog(options);
      const total = listLog.length;
      let newRepositoryName = "";
      if (options?.generationFiles)
        newRepositoryName = await this.createRepoFolder(options);
      if (!newRepositoryName) throw new Error("Repository not created");
      let count = 0;
      for (let index = 0; index < total; index++) {
        count++;
        const item = listLog[index];
        if (!item.files?.length) continue;
        console.time(`${index + 1}/${total}`);
        const isGenerateFiles =
          options?.generationFiles && !!item.files?.length;
        if (isGenerateFiles) {
          await this.createRepoFiles(newRepositoryName, item);
        }
        FileUtils.createOrUpdate(
          `${PATH_GENERATION}/${newRepositoryName}/clone-commits-log.txt`,
          JSON.stringify(item || "{}") + "\n"
        );
        const addGitCommand = new AddGitCommand();
        const commitGitCommand = new CommitGitCommand(
          item,
          options.isMessageRemove
        );
        this.gitInvoker.addCommand(addGitCommand);
        this.gitInvoker.addCommand(commitGitCommand);
        if (count % 50 === 0) {
          const pushGitCommand = new PushGitCommand(true);
          this.gitInvoker.addCommand(pushGitCommand);
        }
        await this.gitInvoker.executeCommands();
        // FileUtils.createOrUpdate(PATH_TEMP_FILE, JSON.stringify(item) + "\n");
        console.timeEnd(`${index + 1}/${total}`);
      }
      console.log("FINALIZA");
    } catch (error) {
      console.log("errordddddd", error);
      throw error;
    }
  }

  public async existRepositoryClone(options: ExecuteCloneOptions) {
    const repositoryNameGitCommand = new RepositoryNameGitCommand(
      options.repositoryClonePath
    );
    const { stdout } = await repositoryNameGitCommand.execute();
    return !!stdout;
  }

  private async createRepoFolder(options: ExecuteCloneOptions) {
    console.time("createRepoFolder");
    const repositoryNameGitCommand = new RepositoryNameGitCommand(
      options.repositoryClonePath
    );
    const { stdout: repositoryName } = await repositoryNameGitCommand.execute();
    console.log("repositoryName", repositoryName);

    FileUtils.createFolder(`${PATH_GENERATION}/${repositoryName}`);
    console.timeEnd("createRepoFolder");
    return repositoryName;
  }

  private async createRepoFiles(repositoryName: string, item: GitCommitItem) {
    if (!item.files?.length) return;
    // console.time("createRepoFiles");
    for (let index = 0; index < item.files!.length; index++) {
      const fileData = item.files[index];
      FileUtils.createOrUpdate(
        `${PATH_GENERATION}/${repositoryName}/${fileData.path}`,
        generation.text(10) + "\n"
      );
    }
    // console.timeEnd("createRepoFiles");
    return true;
  }
}
