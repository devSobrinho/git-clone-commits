import fs from "fs";

const createFolder = async (path: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, { recursive: true }, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

const createFile = async (path: string, content: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

const updateFile = async (path: string, content: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, { flag: "a" }, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

const createOrUpdateFile = async (
  path: string,
  content: string
): Promise<void> => {
  const folder = path.split("/").slice(0, -1).join("/");
  const existFolder = fs.existsSync(folder);
  if (!existFolder) await createFolder(folder);
  const existFile = fs.existsSync(path);
  if (existFile) return updateFile(path, content);
  return createFile(path, content);
};

export const FileUtils = {
  create: createFile,
  update: updateFile,
  createOrUpdate: createOrUpdateFile,
  createFolder,
};
