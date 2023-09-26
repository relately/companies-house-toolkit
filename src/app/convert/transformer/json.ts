import { camelCase } from 'change-case';
import flat from 'flat';
import { filterObjectValues, mapObjectKeys, mapObjectValues } from '../util.js';
import { ItemTransformer, convertDates, trimKeys } from './shared.js';

const convertExclude = ['companyNumber'];

export const transformJson = <T extends Record<string, unknown>>(
  stream: Highland.Stream<T>
): Highland.Stream<Record<string, unknown>> =>
  stream
    .map(trimKeys)
    .map(removeEmptyValues)
    .map(convertNumbers(convertExclude))
    .map(convertDates)
    .map(replaceUnderscoreNumbers)
    .map(unflatten);

const removeEmptyValues: ItemTransformer = filterObjectValues(
  (value) => value !== ''
);

const convertNumbers: (exclude: string[]) => ItemTransformer = (exclude) =>
  mapObjectValues((value, key) => {
    if (typeof value === 'string' && !exclude.includes(camelCase(key))) {
      if (value.match(/^\d+$/)) {
        return parseInt(value);
      } else if (value.match(/^\d+\.\d+$/)) {
        return parseFloat(value);
      }
    }

    return value;
  });

const replaceUnderscoreNumbers: ItemTransformer = mapObjectKeys((key) =>
  key.replaceAll(/_(\d+)/g, (_match, index) => `.${parseInt(index) - 1}`)
);

const unflatten: ItemTransformer = flat.unflatten;
