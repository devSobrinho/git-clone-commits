#!/usr/bin/env node
import { Command } from "commander";
import { CloneRepositoryOptions, ExecuteCloneOptions } from "../interfaces";
import { GitContainer } from "../containers/git-container";
import { CloneCommitsActions } from "./actions/clone-commits-action";

const program = new Command();

program
  .name("git-clone")
  .description("Clone repository commits")
  .version("1.0.0");

program
  .command("commits")
  .description(
    "Creates a new repository clone with filtered commit messages, authors, and dates"
  )
  .action(async (options: CloneRepositoryOptions) => {
    const cloneCommitsActions = new CloneCommitsActions();
    await cloneCommitsActions.execute();
  });

program.parse(process.argv);
