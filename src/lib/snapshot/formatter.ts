import { formatCsv } from '../util/formatters/csv.js';
import { formatJson } from '../util/formatters/json.js';
import { FormatterType } from '../util/formatters/types.js';

export const formatCompanySnapshot = (type: FormatterType) => {
  switch (type) {
    case 'json':
      return formatJson();
    case 'csv':
      return formatCsv(true);
  }
};
