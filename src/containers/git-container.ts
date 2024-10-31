import { LogGitCommand } from "../commands/log-git-command";
import { GitInvoker } from "../invokers/git-invoker";
import { GitRepository } from "../repositories/git-repository";
import { GitService } from "../services/git-service";

export class GitContainer {
  public readonly service: GitService;
  private readonly repository: GitRepository;
  private readonly logGitCommand: LogGitCommand;
  private readonly invoker: GitInvoker;
  constructor(private readonly repositoryPath: string) {
    this.invoker = new GitInvoker();
    this.logGitCommand = new LogGitCommand(this.repositoryPath);
    this.repository = new GitRepository(this.logGitCommand);
    this.service = new GitService(this.invoker, this.repository);
  }
}

// "/home/morcego/Área de trabalho/my/my-portfolio"
