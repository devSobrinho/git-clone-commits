import { TEXT_FILE_SEPARATOR, TEXT_INIT } from "../constants";
import { GitCommitItem } from "../interfaces";

const REGEX = {
  HASH: /\[hash: ([^\]]*)\]/,
  AUTHOR: /\[author: ([^\]]*)\]/,
  DATE: /\[date: ([^\]]*)\]/,
  MESSAGE: /\[message: ([^\]]*)\]/,
  FILES_SEPARATOR: new RegExp(`\\[([A-Z])${TEXT_FILE_SEPARATOR}(.*?)\\]`, "g"),
};

function transformCommits(text: string) {
  const list = text.split(TEXT_INIT).reverse();
  const result: GitCommitItem[] = [];
  for (let index = 0; index < list.length; index++) {
    const textItem = list[index].replace(/\n/g, "");
    const hash = textItem.match(REGEX.HASH)?.[1];
    const author = textItem.match(REGEX.AUTHOR)?.[1];
    const date = textItem.match(REGEX.DATE)?.[1];
    const message = textItem.match(REGEX.MESSAGE)?.[1];
    const filesMatch = textItem.match(REGEX.FILES_SEPARATOR);
    const files = filesMatch?.map((file) => {
      const [statusSplit, pathSplit] = file.split(TEXT_FILE_SEPARATOR);
      const status = statusSplit.slice(1);
      const path = pathSplit.slice(0, -1);
      return { status, path };
    });
    if (hash && author && date && message) {
      result.push({ hash, author, date, message, files });
    }
  }
  return result;
}

export const TransformUtils = {
  commits: transformCommits,
};
