import { formatISO } from 'date-fns';
import { clean } from 'deep-cleaner';
import mapObject from 'map-obj';

export const formatDates = (object: object) =>
  mapObject(
    object,
    (key, value: unknown) => [
      key,
      value instanceof Date
        ? formatISO(value, { representation: 'date' })
        : value,
    ],
    {
      deep: true,
    }
  );

export const trimKeys = <T extends object>(object: object): T =>
  mapObject(object, (key: string, value) => [key.trim(), value]) as T;

export const removeEmptyValues = (object: object) => clean(object);
