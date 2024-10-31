import inquirer from "inquirer";
import { CLONE_COMMITS_QUESTION } from "../questions/clone-commits-question";
import { GitContainer } from "../../containers/git-container";

export class CloneCommitsActions {
  private repositoryClonePath: string = "";
  private lng: keyof typeof CLONE_COMMITS_QUESTION = "en-Us";
  private startDate: Date | undefined;
  private endDate: Date | undefined;
  private authors: string[] = [];
  private removeMessage: boolean = false;
  private generateFiles: boolean = false;

  public async execute() {
    this.lng = await this.selectLng();
    // await this.addRemoteRepository();
    await this.ensureRepositoryExists();
    const gitContainer = new GitContainer(this.repositoryClonePath);
    const existRepository = await gitContainer.service.existRepositoryClone({
      repositoryClonePath: this.repositoryClonePath,
    });
    if (!existRepository) throw new Error("Repository not found");
    await this.ensureStartAndEndDate();
    const isSelectAuthors = await this.questionSelectAuthors();
    if (isSelectAuthors) {
      const authors = await gitContainer.service.getAuthors({
        repositoryClonePath: this.repositoryClonePath,
        dateInit: this.startDate,
        dateEnd: this.endDate,
      });
      if (authors.length) {
        const authorsSelected = await this.handleSelectAuthors(authors);
        if (authorsSelected.length) this.authors = authorsSelected;
      }
    }

    this.removeMessage = await this.questionRemoveMessage();
    this.generateFiles = await this.questionGenerationFiles();

    await gitContainer.service.cloneCommits({
      repositoryClonePath: this.repositoryClonePath,
      author: this.authors.join(";"),
      dateInit: this.startDate,
      dateEnd: this.endDate,
      isMessageRemove: this.removeMessage,
      generationFiles: this.generateFiles,
    });

    return {
      lng: this.lng,
      startDate: this.startDate,
      endDate: this.endDate,
      authors: this.authors,
      removeMessage: this.removeMessage,
      generateFiles: this.generateFiles,
    };
  }

  private async selectLng(): Promise<keyof typeof CLONE_COMMITS_QUESTION> {
    const { lng } = await inquirer.prompt([
      {
        type: "list",
        name: "lng",
        message: CLONE_COMMITS_QUESTION[this.lng].selectLanguage,
        choices: Object.keys(CLONE_COMMITS_QUESTION),
      },
    ]);
    return lng;
  }

  private async addRemoteRepository(): Promise<void> {
    const { repositoryRemote } = await inquirer.prompt([
      {
        type: "input",
        name: "repositoryRemote",
        message: CLONE_COMMITS_QUESTION[this.lng].addRemoteRepository,
      },
    ]);
    const gitContainerRemote = new GitContainer(repositoryRemote);
    try {
      await gitContainerRemote.service.initAndPushRepository(repositoryRemote);
    } catch (error) {
      console.error("Error to add remote repository");
      return await this.addRemoteRepository();
    }
  }

  private async selectRepository(): Promise<string> {
    const { repository } = await inquirer.prompt([
      {
        type: "input",
        name: "repository",
        message: CLONE_COMMITS_QUESTION[this.lng].selectRepository,
      },
    ]);
    return repository;
  }

  private async ensureRepositoryExists(): Promise<GitContainer> {
    this.repositoryClonePath = await this.selectRepository();
    const gitContainer = new GitContainer(this.repositoryClonePath);
    try {
      const existRepository = await gitContainer.service.existRepositoryClone({
        repositoryClonePath: this.repositoryClonePath,
      });
      if (!existRepository) {
        console.error("Repository not found");
        return await this.ensureRepositoryExists();
      }
      return gitContainer;
    } catch (error) {
      console.error("Repository not found");
      return await this.ensureRepositoryExists();
    }
  }

  private async questionSelectDate(): Promise<string> {
    const { selectedOption } = await inquirer.prompt([
      {
        type: "confirm",
        name: "selectedOption",
        message: CLONE_COMMITS_QUESTION[this.lng].selectDate,
      },
    ]);
    return selectedOption;
  }

  private async ensureStartAndEndDate(): Promise<void> {
    const isSelectedDate = await this.questionSelectDate();
    if (isSelectedDate) {
      this.startDate = await this.handleSelectDate(
        CLONE_COMMITS_QUESTION[this.lng].setStartDateFilter
      );
      this.endDate = await this.handleSelectDate(
        CLONE_COMMITS_QUESTION[this.lng].setEndDateFilter
      );
      if (this.startDate.getTime() > this.endDate.getTime()) {
        console.error(
          "The initial date cannot be greater than the final date."
        );
        return await this.ensureStartAndEndDate();
      }
    }
  }

  private async handleSelectDate(message: string): Promise<Date> {
    const { inputDate } = await inquirer.prompt([
      {
        type: "input",
        name: "inputDate",
        message,
      },
    ]);
    const date = new Date(inputDate);
    if (isNaN(date.getTime())) {
      console.error("Invalid date");
      return await this.handleSelectDate(message);
    }
    return date;
  }

  private async questionSelectAuthors(): Promise<boolean> {
    const { confirmInput } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirmInput",
        message: CLONE_COMMITS_QUESTION[this.lng].filterBySelectedAuthors,
      },
    ]);
    return confirmInput;
  }

  private async handleSelectAuthors(authors: string[]): Promise<string[]> {
    const { selectedOption } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "selectedOption",
        message: CLONE_COMMITS_QUESTION[this.lng].filterByAuthors,
        choices: authors,
      },
    ]);
    return selectedOption;
  }

  private async questionRemoveMessage(): Promise<boolean> {
    const { confirmInput } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirmInput",
        message: CLONE_COMMITS_QUESTION[this.lng].removeCommitMessagePrompt,
      },
    ]);
    return confirmInput;
  }

  private async questionGenerationFiles(): Promise<boolean> {
    const { confirmInput } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirmInput",
        message: CLONE_COMMITS_QUESTION[this.lng].generateFilesPrompt,
      },
    ]);
    return confirmInput;
  }
}
