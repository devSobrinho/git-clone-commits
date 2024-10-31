import { exec } from "child_process";
import { GitCommitItem } from "../interfaces";
import { GitCommand } from "../models/git-command";
import { quote } from "shell-quote";

export class CommitGitCommand implements GitCommand {
  constructor(
    private readonly item: GitCommitItem,
    private readonly isMessageRemove?: boolean
  ) {}

  public async execute(): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      if (!!this.isMessageRemove) this.item.message = ".";
      const sanitizedMessage = quote([this.item.message]);
      const command = `GIT_COMMITTER_DATE="${this.item.date}" GIT_AUTHOR_DATE="${this.item.date}" git commit -m ${sanitizedMessage}`;
      exec(command, { cwd: process.cwd() }, (err, stdout, stderr) => {
        if (err) return reject(err);
        resolve({ stdout, stderr });
      });
    });
  }
}
