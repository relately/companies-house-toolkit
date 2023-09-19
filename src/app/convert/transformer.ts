import { FormatterType } from './formatter.js';
import { transformCsv } from './transformer/csv.js';
import { transformJson } from './transformer/json.js';

export const getTransformer = (formatterType: FormatterType) => {
  switch (formatterType) {
    case 'csv':
      return transformCsv;
    case 'json':
      return transformJson;
  }
};
