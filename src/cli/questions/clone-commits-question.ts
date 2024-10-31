type CloneCommitsQuestionLng = {
  selectLanguage: string;
  addRemoteRepository: string;
  selectRepository: string;
  selectDate: string;
  setStartDateFilter: string;
  setEndDateFilter: string;
  filterBySelectedAuthors: string;
  filterByAuthors: string;
  removeCommitMessagePrompt: string;
  generateFilesPrompt: string;
};

type CloneCommitsQuestion = {
  "pt-Br": CloneCommitsQuestionLng;
  "en-Us": CloneCommitsQuestionLng;
};

export const CLONE_COMMITS_QUESTION: CloneCommitsQuestion = {
  "pt-Br": {
    selectLanguage: "Selecione o idioma da aplicação",
    addRemoteRepository:
      "Informe o caminho do repositório remoto onde o clone será salvo",
    selectRepository:
      "Informe o caminho do repositório local que deseja clonar",
    selectDate: "Deseja selecionar data para filtrar commits?",
    setStartDateFilter: "Definir data inicial para filtrar commits",
    setEndDateFilter: "Definir data final para filtrar commits",
    filterBySelectedAuthors: "Deseja selecionar autores para filtrar commits?",
    filterByAuthors: "Definir autores para filtrar commits",
    removeCommitMessagePrompt: "Deseja remover a mensagem do commit?",
    generateFilesPrompt: "Deseja gerar arquivos?",
  },
  "en-Us": {
    selectLanguage: "Select the application language",
    addRemoteRepository:
      "Specify the remote repository path where the clone will be saved",
    selectRepository:
      "Specify the path of the local repository you want to clone",
    selectDate: "Do you want to select date to filter commits?",
    setStartDateFilter: "Set start date to filter commits",
    setEndDateFilter: "Set end date to filter commits",
    filterBySelectedAuthors: "Do you want to select authors to filter commits?",
    filterByAuthors: "Set authors to filter commits",
    removeCommitMessagePrompt: "Do you want to remove the commit message?",
    generateFilesPrompt: "Do you want to generate files?",
  },
} as const;
