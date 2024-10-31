import { GitCommand } from "../models/git-command";

export class GitInvoker {
  private commands: GitCommand[] = [];

  addCommand(command: GitCommand) {
    this.commands.push(command);
  }

  public async executeCommands(): Promise<void> {
    for (const command of this.commands) {
      await command.execute();
    }
    this.clearCommands();
  }

  private clearCommands() {
    this.commands = [];
  }
}
