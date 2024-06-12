export type Product216LineType =
  | 'header'
  | 'company'
  | 'person'
  | 'trailer'
  | 'unknown';

export type Product216Header = {
  runNumber: number;
  fileProductionDate: string;
};

export type Product216Record = Product216PersonRecord | Product216CompanyRecord;

export type Product216PersonRecord = {
  companyNumber: string;
  applicationDateOrigin: ApplicationDateOrigin | '';
  appointmentType: AppointmentType | '';
  personNumber: string;
  isCorporateBody: false;
  appointmentDate?: string;
  resignationDate?: string;
  personPostcode: string;
  partialDateOfBirth?: string;
  fullDateOfBirth?: string;
  title?: string;
  forenames?: string;
  surname?: string;
  honours?: string;
  careOf?: string;
  poBox?: string;
  addressLine1?: string;
  addressLine2?: string;
  postTown?: string;
  county?: string;
  country?: string;
  occupation?: string;
  nationality?: string;
  usualResidentialCountry?: string;
};

export type Product216CompanyRecord = {
  companyNumber: string;
  isCorporateBody: true;
  status: CompanyStatus | '';
  name: string;
};

type ApplicationDateOrigin =
  | 'Appointment Document'
  | 'Annual Return'
  | 'Incorporation Document'
  | 'LLP Appointment Document'
  | 'LLP Incorporation Document'
  | 'Overseas Company Appointment Document';
type AppointmentType =
  | 'Current Secretary'
  | 'Current Director'
  | 'Current Non-Designated LLP Member'
  | 'Current Designated LLP Member'
  | 'Current Judicial Factor'
  | 'Current Receiver or Manager Appointed Under the Charities Act'
  | 'Current Manager appointed under the CAICE Act'
  | 'Current SE Member of Administrative Organisation'
  | 'Current SE Member of Supervisory Organisation'
  | 'Current SE Member of Management Organisation'
  | 'Resigned Secretary'
  | 'Resigned Director';

type CompanyStatus =
  | 'Converted/closed company'
  | 'Dissolved company'
  | 'Company in liquidation'
  | 'Company in receivership'
  | 'Other';
