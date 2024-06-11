import { Officer } from '../../types/officer.js';
import { Address } from '../../types/shared.js';
import { parseIsoDate } from '../../util/dates.js';
import {
  Product216CompanyRecord,
  Product216PersonRecord,
  Product216Record,
} from './parser/types.js';

export const transformProduct216 = (record: Product216Record): Officer => {
  if (record.isCorporateBody) {
    return transformProduct217Company(record);
  }

  return transformProduct216Person(record);
};

const transformProduct217Company = (
  record: Product216CompanyRecord
): Officer => {
  return {
    name: record.name,
    appointed_to: {
      company_number: record.companyNumber,
    },
    is_corporate_body: true,
  };
};

const transformProduct216Person = (record: Product216PersonRecord): Officer => {
  return {
    address: transformAddress(record),
    appointed_on: record.appointmentDate,
    appointed_to: {
      company_number: record.companyNumber,
    },
    country_of_residence: record.usualResidentialCountry,
    date_of_birth: record.partialDateOfBirth
      ? transformDateOfBirth(record.partialDateOfBirth, record.fullDateOfBirth)
      : undefined,
    is_corporate_body: record.isCorporateBody,
    is_pre_1992_appointment: record.appointmentDate
      ? transformIsPre1992Appointment(record.appointmentDate)
      : undefined,
    name: [record.title, record.forenames, record.surname, record.honours]
      .filter((component) => !!component)
      .join(' '),
    name_elements: {
      forename: record.forenames?.split(' ')[0],
      honours: record.honours,
      other_forenames: record.forenames?.split(' ').slice(1).join(' '),
      surname: record.surname || '',
      title: record.title,
    },
    nationality: record.nationality,
    occupation: record.occupation,
    officer_role: transformAppointmentType(record.appointmentType),
    person_number: record.personNumber,
    resigned_on: record.resignationDate,
  };
};

const transformDateOfBirth = (
  partialDateOfBirth: string,
  fullDateOfBirth?: string
) => {
  const [year, month, day] = fullDateOfBirth
    ? fullDateOfBirth.split('-')
    : partialDateOfBirth.split('-');

  return {
    day: day ? parseInt(day) : undefined,
    month: parseInt(month),
    year: parseInt(year),
  };
};

const transformAddress = (record: Product216PersonRecord): Address => {
  return {
    care_of: record.careOf,
    po_box: record.poBox,
    address_line_1: record.addressLine1,
    address_line_2: record.addressLine2,
    locality: record.postTown,
    region: record.county,
    postal_code: record.personPostcode,
    country: record.country,
  };
};

const transformAppointmentType = (
  appointmentType: Product216PersonRecord['appointmentType']
): Officer['officer_role'] => {
  switch (appointmentType) {
    case 'Current Secretary':
      return 'secretary';
    case 'Current Director':
      return 'director';
    case 'Current Non-Designated LLP Member':
      return 'llp-member';
    case 'Current Designated LLP Member':
      return 'llp-designated-member';
    case 'Current Judicial Factor':
      return 'judicial-factor';
    case 'Current Receiver or Manager Appointed Under the Charities Act':
      return 'receiver-and-manager';
    case 'Current Manager appointed under the CAICE Act':
      return 'cic-manager';
    case 'Current SE Member of Administrative Organisation':
      return 'member-of-an-administrative-organ';
    case 'Current SE Member of Supervisory Organisation':
      return 'member-of-a-supervisory-organ';
    case 'Current SE Member of Management Organisation':
      return 'member-of-a-management-organ';
    case 'Resigned Secretary':
      return 'secretary';
    case 'Resigned Director':
      return 'director';
    default:
      return undefined;
  }
};

const transformIsPre1992Appointment = (
  appointmentDate: string
): boolean | undefined => {
  const date = parseIsoDate(appointmentDate);

  if (!date) {
    return undefined;
  }

  return date < new Date('1992-01-01');
};
