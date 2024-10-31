import lodash from "lodash";

import { LogGitCommand } from "../commands/log-git-command";
import { ExecuteCloneOptions, GitCommitItem } from "../interfaces";
import { TransformUtils } from "../utils/transform";
import { DateUtil } from "../utils/date";
import { RepositoryNameGitCommand } from "../commands/repository-name-git-command";

export class GitRepository {
  constructor(private readonly logGitCommand: LogGitCommand) {}
  // private readonly addGitCommand: AddGitCommand,
  // private readonly commitGitCommand: CommitGitCommand,
  // private readonly pushGitCommand: PushGitCommand,
  // private readonly repositoryNameGitCommand: RepositoryNameGitCommand

  public async getFilteredLog(options: ExecuteCloneOptions) {
    this.logGitCommand.setOptions(options);
    const { stdout } = await this.logGitCommand.execute();
    const list = TransformUtils.commits(stdout);
    const listLog = list.filter((item) => {
      if (options?.authorLike) {
        const authorLike = options.authorLike.toLowerCase().split(";");
        return authorLike.some((author) =>
          item.author.toLowerCase().includes(author)
        );
      }
      if (options?.author) {
        const authors = options.author.toLowerCase().split(";");
        return authors.includes(item.author.toLowerCase());
      }
      return true;
    });

    return listLog;
  }

  public async getAuthors(options: ExecuteCloneOptions) {
    try {
      const listLog = await this.getFilteredLog(options);
      const listAuthor = listLog.map((item) => item.author);
      return lodash.uniq(listAuthor);
    } catch (error: any) {
      if (error.code === "ENOENT") throw new Error("Repository not found");
      throw error;
    }
  }

  public async resolveCommitDateRange(options: ExecuteCloneOptions) {
    let dateInit = options?.dateInit;
    let dateEnd = options?.dateEnd;
    if (!dateInit || !dateEnd) {
      const range = await this.getCommitDateRange(options);
      if (!dateInit) dateInit = range.dateInit;
      if (!dateEnd) dateEnd = range.dateEnd;
    }
    return { dateInit, dateEnd };
  }

  private async getCommitDateRange(options: ExecuteCloneOptions) {
    const [firstCommit, lastCommit] = await Promise.all([
      await this.firstCommit(options),
      await this.lastCommit(options),
    ]);
    if (!firstCommit) throw new Error("No first commit found");
    if (!lastCommit) throw new Error("No last commit found");
    const dateInit = new Date(firstCommit.date);
    const dateEnd = new Date(lastCommit.date);
    return { dateInit, dateEnd };
  }

  private async firstCommit(options: ExecuteCloneOptions) {
    options.isFirstCommit = true;
    options.isLastCommit = false;
    options.generationFiles = true;
    this.logGitCommand.setOptions(options);
    const { stdout } = await this.logGitCommand.execute();
    return TransformUtils.commits(stdout)?.[0] || null;
  }

  private async lastCommit(options: ExecuteCloneOptions) {
    options.isFirstCommit = false;
    options.isLastCommit = true;
    this.logGitCommand.setOptions(options);
    const { stdout } = await this.logGitCommand.execute();
    return TransformUtils.commits(stdout)?.[0] || null;
  }
}

// const gitRepository = new GitRepository();
// gitRepository
//   .test({
//     pathRepository: "/home/morcego/Área de trabalho/workspace/front-sgpweb",
//     options: {
//       dateInit: new Date("2024-01-01 00:00:00"),
//       dateEnd: new Date("2024-01-30 23:59:59"),
//     },
//   })
//   .then(console.log)
//   .catch(console.error);
