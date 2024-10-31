import { exec } from "child_process";
import { GitCommand } from "../models/git-command";

export class RepositoryNameGitCommand implements GitCommand {
  constructor(private readonly repositoryPath: string) {}

  public async execute(): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      exec(
        "git rev-parse --show-toplevel",
        { cwd: this.repositoryPath },
        (err, stdout, stderr) => {
          if (err) return reject(`Erro: ${stderr}`);
          const repoName = stdout.trim().split("/").pop();
          if (repoName) return resolve({ stdout: repoName, stderr: "" });
          else {
            reject("Nome do repositório não encontrado");
          }
        }
      );
    });
  }
}
