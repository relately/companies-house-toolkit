import { transformProduct216 } from '../products/216/transformer.js';
import { formatCsv } from '../util/formatters/csv.js';
import { formatJson } from '../util/formatters/json.js';
import { FormatterType } from '../util/formatters/types.js';
import { compose, map } from '../util/streams.js';

export const convertProduct216 = (formatterType: FormatterType) =>
  compose(map(transformProduct216), formatProduct216(formatterType));

const formatProduct216 = (type: FormatterType) => {
  switch (type) {
    case 'json':
      return formatJson();
    case 'csv':
      return formatCsv([
        'address',
        'appointed_on',
        'appointed_to.company_number',
        'country_of_residence',
        'date_of_birth',
        'is_corporate_body',
        'is_pre_1992_appointment',
        'name',
        'name_elements.forename',
        'name_elements.honours',
        'name_elements.other_forenames',
        'name_elements.surname',
        'name_elements.title',
        'nationality',
        'occupation',
        'officer_role',
        'person_number',
        'resigned_on',
      ]);
  }
};
