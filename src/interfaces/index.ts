type FileContentItem = { path: string; status: string };

export type GitCommitItem = {
  hash: string;
  author: string;
  date: string;
  message: string;
  files?: FileContentItem[];
};

export type CloneRepositoryOptions = {
  author?: string;
  authorLike?: string;
  dateInit?: Date;
  dateEnd?: Date;
  messageRemove?: string;
  listAuthor?: string;
};

type OtherOptions = {
  isFirstCommit?: boolean;
  isLastCommit?: boolean;
  generationFiles?: boolean;
};

export type ExecuteCloneOptions = {
  repositoryClonePath: string;
  author?: string;
  authorLike?: string;
  dateInit?: Date;
  dateEnd?: Date;
  isMessageRemove?: boolean;
} & OtherOptions;

export type ExecuteInput = {
  pathRepository: string;
  options?: ExecuteCloneOptions;
};
