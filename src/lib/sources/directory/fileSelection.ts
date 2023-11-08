import { isAfter, parse } from 'date-fns';

export const allFiles = (files: string[]) => files.sort();

export const latestFile = (files: string[]) =>
  files.sort().slice(files.length - 1);

export const filesAfter = (date: Date, files: string[]) => {
  return files
    .filter((file) => {
      const dateMatch = file.match(/.*(\d{4}\/\d{2}\/\d{2}).*/);

      if (!dateMatch || dateMatch.length < 2) {
        throw new Error(
          `File "${file}" is not in a directory structure that represents dates`
        );
      }

      const fileDate = parse(dateMatch[1], 'yyyy/MM/dd', new Date());

      return isAfter(fileDate, date);
    })
    .sort();
};
