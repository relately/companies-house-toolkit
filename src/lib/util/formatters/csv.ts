import { format } from 'fast-csv';
import flat from 'flat';

export const formatCsv = <T extends object>(
  columns: string[] | boolean = true
) =>
  format({ headers: columns, writeHeaders: true }).transform(
    (record: unknown) => flat.flatten(record as T)
  );
