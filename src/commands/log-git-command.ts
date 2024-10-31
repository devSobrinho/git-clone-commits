import { TEXT_FILE_SEPARATOR, TEXT_INIT } from "../constants";
import { ExecuteCloneOptions } from "../interfaces";
import { GitCommand } from "../models/git-command";
import { spawn } from "child_process";

export class LogGitCommand implements GitCommand {
  constructor(
    public readonly pathRepository: string,
    private options?: ExecuteCloneOptions
  ) {}

  public setOptions(options?: ExecuteCloneOptions) {
    this.options = options;
  }

  public async execute(): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      const commandParts = this.commandGenerated(this.options);

      const gitLog = spawn(commandParts[0], commandParts.slice(1), {
        cwd: this.pathRepository,
      });

      let stdout = "";
      let stderr = "";

      gitLog.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      gitLog.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      gitLog.on("exit", (code) => {
        // console.log("exit", code);
      });
      gitLog.on("disconnect", () => {
        // console.log("disconnect");
      });
      gitLog.on("close", () => {
        // console.log("close");
      });
      gitLog.on("message", (message) => {
        // console.log("message", message);
      });

      gitLog.on("close", (code) => {
        if (code) {
          return reject(
            new Error(`Process exited with code ${code}: ${stderr}`)
          );
        }
        if (!stdout) {
          return reject(new Error("No commits found"));
        }

        const formattedOutput = stdout.replace(
          /^([A-Z])\t(.*)$/gm,
          `[${"$1" + TEXT_FILE_SEPARATOR + "$2"}]`
        );

        resolve({ stdout: formattedOutput, stderr });
      });
    });
  }

  private commandGenerated(options?: ExecuteCloneOptions): string[] {
    let addCommand = "";
    if (options && options.isFirstCommit)
      addCommand = "--reverse --max-parents=0";
    if (options && options.isLastCommit) addCommand = "-1";

    const command = [
      "git",
      "log",
      ...addCommand.split(" ").filter(Boolean),
      `--pretty=format:${TEXT_INIT}[hash: %h] [author: %an] [date: %ad] [message: %B]`,
      `--date=format:%Y-%m-%d %H:%M:%S`,
    ];

    if (options && options.dateInit && options.dateEnd) {
      const dateInit = options?.dateInit
        ?.toISOString()
        .replace(/T.*/, " 00:00:00");
      const dateEnd = options?.dateEnd
        ?.toISOString()
        .replace(/T.*/, " 23:59:59");
      command.push(`--since="${dateInit}"`, `--until="${dateEnd}"`);
    }

    if (options && !!options.generationFiles) {
      command.push(`--name-status`);
    }

    // console.log(options, command.join(" "));
    return command;
  }
}
