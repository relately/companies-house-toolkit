import { parse } from 'fast-csv';

export const getParser = () => {
  return parse({ headers: true });
};
