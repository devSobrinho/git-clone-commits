import { exec } from "child_process";
import { GitCommand } from "../models/git-command";

export class AddGitCommand implements GitCommand {
  public async execute(): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      exec(`git add .`, { cwd: process.cwd() }, (err, stdout, stderr) => {
        if (err) return reject(err);
        resolve({ stdout, stderr });
      });
    });
  }
}
