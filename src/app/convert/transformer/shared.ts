import { formatISO, isValid, parse } from 'date-fns';
import { mapObjectKeys, mapObjectValues } from '../util.js';

export type ItemTransformer = (
  object: Record<string, unknown>
) => Record<string, unknown>;

export const trimKeys = mapObjectKeys((key) => key.trim());

export const convertDates: ItemTransformer = mapObjectValues((value) => {
  if (typeof value === 'string' && value.match(/\d{2}\/\d{2}\/\d{4}/)) {
    const parsed = parse(value, 'dd/MM/yyyy', new Date());

    if (isValid(parsed)) {
      return formatISO(parsed, { representation: 'date' });
    }
  }

  return value;
});
