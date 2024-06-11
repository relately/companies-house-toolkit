import { parseDatFormatDate } from '../../../util/dates.js';
import { Product216PersonRecord } from './types.js';

export const parsePersonRecord = (line: string): Product216PersonRecord => {
  return {
    companyNumber: line.substring(0, 8),
    applicationDateOrigin: parseApplicationDateOrigin(line.charAt(9)),
    appointmentType: parseAppointmentType(line.substring(10, 12)),
    personNumber: line.substring(12, 24),
    isCorporateBody: false,
    appointmentDate: parseDatFormatDate(line.substring(32, 40)),
    resignationDate: parseDatFormatDate(line.substring(40, 48)),
    personPostcode: line.substring(48, 56).trim(),
    partialDateOfBirth:
      line.substring(56, 62).trim() !== ''
        ? `${line.substring(56, 60)}-${line.substring(60, 62)}`
        : undefined,
    fullDateOfBirth: parseDatFormatDate(line.substring(64, 72)),
    ...parsePersonVariableData(line.substring(76)),
  };
};

const parseApplicationDateOrigin = (
  originCode: string
): Product216PersonRecord['applicationDateOrigin'] | '' => {
  const mapping: Record<
    string,
    Product216PersonRecord['applicationDateOrigin']
  > = {
    '1': 'Appointment Document',
    '2': 'Annual Return',
    '3': 'Incorporation Document',
    '4': 'LLP Appointment Document',
    '5': 'LLP Incorporation Document',
    '6': 'Overseas Company Appointment Document',
  };

  return mapping[originCode] || '';
};

const parseAppointmentType = (
  appointmentTypeCode: string
): Product216PersonRecord['appointmentType'] | '' => {
  const mapping: Record<string, Product216PersonRecord['appointmentType']> = {
    '00': 'Current Secretary',
    '01': 'Current Director',
    '02': 'Resigned Secretary',
    '03': 'Resigned Director',
    '04': 'Current Non-Designated LLP Member',
    '05': 'Current Designated LLP Member',
    '11': 'Current Judicial Factor',
    '12': 'Current Receiver or Manager Appointed Under the Charities Act',
    '13': 'Current Manager appointed under the CAICE Act',
    '17': 'Current SE Member of Administrative Organisation',
    '18': 'Current SE Member of Supervisory Organisation',
    '19': 'Current SE Member of Management Organisation',
  };

  return mapping[appointmentTypeCode] || '';
};

const parsePersonVariableData = (
  data: string
): Pick<
  Product216PersonRecord,
  | 'title'
  | 'forenames'
  | 'surname'
  | 'honours'
  | 'careOf'
  | 'poBox'
  | 'addressLine1'
  | 'addressLine2'
  | 'postTown'
  | 'county'
  | 'country'
  | 'occupation'
  | 'nationality'
  | 'usualResidentialCountry'
> => {
  const parts = data.substring(-1).split('<');

  const cells = [
    'title',
    'forenames',
    'surname',
    'honours',
    'careOf',
    'poBox',
    'addressLine1',
    'addressLine2',
    'postTown',
    'county',
    'country',
    'occupation',
    'nationality',
    'usualResidentialCountry',
  ];

  return cells.reduce(
    (result, cell, index) => ({
      ...result,
      [cell]: parts[index] !== '' ? parts[index] : undefined,
    }),
    {}
  );
};
