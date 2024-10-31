import { GitCommandOutput } from "../interfaces/git-command-output";

export interface GitCommand {
  execute(): Promise<GitCommandOutput>;
}
