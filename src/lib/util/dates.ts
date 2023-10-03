import { isValid, parse, parseISO } from 'date-fns';

export const parseUkDate = (value: string): Date | undefined => {
  if (typeof value === 'string' && value.match(/\d{2}\/\d{2}\/\d{4}/)) {
    const parsed = parse(value, 'dd/MM/yyyy', new Date());

    if (isValid(parsed)) {
      return parsed;
    }
  }

  return undefined;
};

export const parseIsoDate = (value: string): Date | undefined => {
  if (typeof value === 'string' && value.match(/\d{4}-\d{2}-\d{2}/)) {
    const parsed = parseISO(value);

    if (isValid(parsed)) {
      return parsed;
    }
  }

  return undefined;
};
