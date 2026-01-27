import fs from 'fs';

export const createDirectory = (directoryPath: string) => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }
};