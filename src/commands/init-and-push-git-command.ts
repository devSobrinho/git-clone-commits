import { exec } from "child_process";
import { GitCommand } from "../models/git-command";
import path from "path";
import * as fs from "fs/promises";

export class InitAndPushGitCommand implements GitCommand {
  private attempts = 0;
  constructor(private readonly remoteUrl: string) {}

  public async execute(): Promise<{ stdout: string; stderr: string }> {
    try {
      return this.initializeAndPush();
    } catch (error) {
      this.attempts++;
      if (this.attempts === 3) {
        throw new Error("Failed to push to remote repository");
      }
      await this.removeGitDirectory();
      return await this.initializeAndPush();
    }
  }

  private async initializeAndPush(): Promise<{
    stdout: string;
    stderr: string;
  }> {
    await this.runCommand(`git init`);
    await this.runCommand(`git add .`);
    await this.runCommand(`git commit -m "Initial commit"`);
    await this.runCommand(`git branch -M main`);
    const remoteExists = await this.checkRemoteExists("origin");
    if (remoteExists) {
      await this.runCommand(`git remote set-url origin ${this.remoteUrl}`);
    } else {
      await this.runCommand(`git remote add origin ${this.remoteUrl}`);
    }
    await this.runCommand(`git pull --rebase origin main`);
    const result = await this.runCommand(`git push -u origin main`);
    return result;
  }

  private async runCommand(
    command: string
  ): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      exec(command, { cwd: process.cwd() }, (err, stdout, stderr) => {
        if (err) return reject(err);
        resolve({ stdout, stderr });
      });
    });
  }

  private async checkRemoteExists(remoteName: string): Promise<boolean> {
    try {
      const { stdout } = await this.runCommand(
        `git remote get-url ${remoteName}`
      );
      return !!stdout.trim();
    } catch (error) {
      return false;
    }
  }

  private async removeGitDirectory(): Promise<void> {
    const gitPath = path.join(process.cwd(), ".git");
    try {
      await fs.rm(gitPath, { recursive: true, force: true });
    } catch (error) {
      throw new Error("Failed to remove git directory");
    }
  }
}
