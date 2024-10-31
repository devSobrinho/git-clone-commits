import { exec } from "child_process";
import { GitCommand } from "../models/git-command";

export class PushGitCommand implements GitCommand {
  constructor(private readonly isSkipError: boolean) {}

  public async execute(): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      exec(`git push`, { cwd: process.cwd() }, (err, stdout, stderr) => {
        console.log("entrando en push");

        if (this.isSkipError) {
          console.log("entrando en skip error");

          return resolve({ stdout, stderr });
        }
        if (err) {
          console.log(!!err, "fufu");

          return reject(err);
        }
        console.log("entrando en resolve");
        resolve({ stdout, stderr });
      });
    });
  }
}
