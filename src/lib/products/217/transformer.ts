import { CompanyAccountsType } from '../../types/company.js';
import {
  convertUkDateToIsoDate,
  formatIsoDate,
  parseUkDate,
} from '../../util/dates.js';
import { convertToTitleCase } from '../../util/strings.js';
import { getAccountsNextMadeUpToDate } from '../shared/company.js';
import { Product217Record } from './parser/types.js';
import { Product217Company } from './transformer/types.js';

export const transformProduct217 = (
  record: Product217Record
): Product217Company => ({
  accounts: transformAccounts(record),
  company_name: record.CompanyName,
  company_number: record.CompanyNumber,
  company_status: transformCompanyStatus(record.CompanyStatus),
  confirmation_statement: transformConfirmationStatement(record),
  date_of_creation: convertUkDateToIsoDate(record['IncorporationDate']),
  date_of_cessation: convertUkDateToIsoDate(record['DissolutionDate']),
  has_charges: parseInt(record['Mortgages.NumMortCharges']) > 0,
  links: {
    self: `/company/${record.CompanyNumber}`,
  },
  registered_office_address: transformRegisteredOfficeAddress(record),
  sic_codes: transformSicCodes(record),
  previous_company_names: transformPreviousCompanyNames(record),
  type: transformCompanyType(record['CompanyCategory']),
});

const transformAccounts = (
  record: Product217Record
): Product217Company['accounts'] => {
  const accountingReferenceDay = record['Accounts.AccountRefDay']
    ? parseInt(record['Accounts.AccountRefDay'])
    : undefined;
  const accountingReferenceMonth = record['Accounts.AccountRefMonth']
    ? parseInt(record['Accounts.AccountRefMonth'])
    : undefined;
  const lastMadeUpTo = parseUkDate(record['Accounts.LastMadeUpDate']);
  const nextDue = parseUkDate(record['Accounts.NextDueDate']);

  return {
    next_made_up_to: getAccountsNextMadeUpToDate(
      accountingReferenceMonth,
      accountingReferenceDay,
      lastMadeUpTo,
      nextDue,
      record['IncorporationDate']
        ? parseUkDate(record['IncorporationDate'])
        : undefined
    ),
    next_due: nextDue ? formatIsoDate(nextDue) : undefined,
    last_accounts: {
      made_up_to: lastMadeUpTo ? formatIsoDate(lastMadeUpTo) : undefined,
      type: transformAccountsType(record['Accounts.AccountCategory']),
    },
    accounting_reference_date: {
      day: accountingReferenceDay,
      month: accountingReferenceMonth,
    },
  };
};

const transformConfirmationStatement = (
  record: Product217Record
): Product217Company['confirmation_statement'] => ({
  next_due: convertUkDateToIsoDate(record['ConfStmtNextDueDate']),
  last_made_up_to: convertUkDateToIsoDate(record['ConfStmtLastMadeUpDate']),
  next_made_up_to: getConfirmationStatementNextMadeUpDate(
    parseUkDate(record['ConfStmtLastMadeUpDate']),
    parseUkDate(record['IncorporationDate'])
  ),
});

const transformRegisteredOfficeAddress = (
  record: Product217Record
): Product217Company['registered_office_address'] => ({
  address_line_1: convertToTitleCase(record['RegAddress.AddressLine1']),
  address_line_2: convertToTitleCase(record['RegAddress.AddressLine2']),
  care_of: convertToTitleCase(record['RegAddress.CareOf']),
  locality: convertToTitleCase(record['RegAddress.PostTown']),
  po_box: convertToTitleCase(record['RegAddress.POBox']),
  country: convertToTitleCase(record['RegAddress.Country']),
  postal_code: record['RegAddress.PostCode'] || undefined,
  region: convertToTitleCase(record['RegAddress.County']),
});

const transformSicCodes = (
  record: Product217Record
): Product217Company['sic_codes'] =>
  [
    record['SICCode.SicText_1'],
    record['SICCode.SicText_2'],
    record['SICCode.SicText_3'],
    record['SICCode.SicText_4'],
  ]
    .filter((code) => code !== '' && code !== 'None Supplied')
    .map((code) => parseInt(code).toString());

const transformPreviousCompanyNames = (
  record: Product217Record
): Product217Company['previous_company_names'] => {
  const previousNames: Product217Company['previous_company_names'] = [];

  for (let i = 1; i <= 10; i++) {
    const previousName =
      record[`PreviousName_${i}.CompanyName` as keyof Product217Record];

    if (previousName !== '') {
      const lastCondate = convertUkDateToIsoDate(
        record[`PreviousName_${i + 1}.CONDATE` as keyof Product217Record]
      );

      previousNames.push({
        ceased_on: convertUkDateToIsoDate(
          record[`PreviousName_${i}.CONDATE` as keyof Product217Record]
        ),
        effective_from:
          lastCondate || convertUkDateToIsoDate(record['IncorporationDate']),
        name: previousName,
      });
    }
  }

  return previousNames.length > 0 ? previousNames : undefined;
};

const transformAccountsType = (
  type: Product217Record['Accounts.AccountCategory']
): CompanyAccountsType | undefined => {
  switch (type) {
    case 'ACCOUNTS TYPE NOT AVAILABLE':
      return 'no-accounts-type-available';
    case 'AUDIT EXEMPTION SUBSIDIARY':
      return 'audit-exemption-subsidiary';
    case 'AUDITED ABRIDGED':
      return 'audited-abridged';
    case 'DORMANT':
      return 'dormant';
    case 'FILING EXEMPTION SUBSIDIARY':
      return 'filing-exemption-subsidiary';
    case 'FULL':
      return 'full';
    case 'GROUP':
      return 'group';
    case 'INITIAL':
      return 'initial';
    case 'MEDIUM':
      return 'medium';
    case 'MICRO ENTITY':
      return 'micro-entity';
    case 'PARTIAL EXEMPTION':
      return 'partial-exemption';
    case 'SMALL':
      return 'small';
    case 'TOTAL EXEMPTION FULL':
      return 'total-exemption-full';
    case 'TOTAL EXEMPTION SMALL':
      return 'total-exemption-small';
    case 'UNAUDITED ABRIDGED':
      return 'audited-abridged';
    case 'NO ACCOUNTS FILED':
    default:
      return undefined;
  }
};

const getConfirmationStatementNextMadeUpDate = (
  lastMadeUpDate?: Date,
  incorporationDate?: Date
): string | undefined => {
  if (lastMadeUpDate) {
    const nextDate = new Date(lastMadeUpDate);
    nextDate.setFullYear(nextDate.getFullYear() + 1);

    return formatIsoDate(nextDate);
  }

  if (incorporationDate) {
    const nextDate = new Date(incorporationDate);
    nextDate.setFullYear(nextDate.getFullYear() + 1);
    nextDate.setDate(nextDate.getDate() - 1);

    return formatIsoDate(nextDate);
  }
};

const transformCompanyStatus = (
  status: Product217Record['CompanyStatus']
): Product217Company['company_status'] => {
  switch (status) {
    case 'Active':
    case 'Active - Proposal to Strike off':
      return 'active';
    case 'ADMINISTRATION ORDER':
      return 'administration';
    case 'ADMINISTRATIVE RECEIVER':
      return 'receivership';
    case 'In Administration':
      return 'administration';
    case 'In Administration/Administrative Receiver':
      return 'insolvency-proceedings';
    case 'In Administration/Receiver Manager':
      return 'administration';
    case 'Liquidation':
      return 'liquidation';
    case 'Live but Receiver Manager on at least one charge':
    case 'RECEIVER MANAGER / ADMINISTRATIVE RECEIVER':
    case 'RECEIVERSHIP':
      return 'receivership';
    case 'Voluntary Arrangement':
      return 'voluntary-arrangement';
    case 'VOLUNTARY ARRANGEMENT / ADMINISTRATIVE RECEIVER':
      return 'insolvency-proceedings';
  }
};

const transformCompanyType = (
  type: Product217Record['CompanyCategory']
): Product217Company['type'] | undefined => {
  switch (type) {
    case 'Charitable Incorporated Organisation':
      return 'charitable-incorporated-organisation';
    case 'Community Interest Company':
      return undefined;
    case 'Converted/Closed':
      return 'converted-or-closed';
    case 'Private Limited Company':
      return 'ltd';
    case 'Further Education and Sixth Form College Corps':
      return 'further-education-or-sixth-form-college-corporation';
    case 'Industrial and Provident Society':
      return 'industrial-and-provident-society';
    case 'Investment Company with Variable Capital':
      return 'investment-company-with-variable-capital';
    case 'Investment Company with Variable Capital (Securities)':
      return 'icvc-securities';
    case 'Investment Company with Variable Capital(Umbrella)':
      return 'icvc-umbrella';
    case 'Limited Liability Partnership':
      return 'llp';
    case 'Limited Partnership':
      return 'limited-partnership';
    case 'Old Public Company':
      return 'old-public-company';
    case 'Other Company Type':
      return 'other';
    case 'Overseas Entity':
      return 'registered-overseas-entity';
    case "PRI/LBG/NSC (Private, Limited by guarantee, no share capital, use of 'Limited' exemption)":
      return 'private-limited-guarant-nsc-limited-exemption';
    case 'PRI/LTD BY GUAR/NSC (Private, limited by guarantee, no share capital)':
      return 'private-limited-guarant-nsc';
    case 'PRIV LTD SECT. 30 (Private limited company, section 30 of the Companies Act)':
      return 'private-limited-shares-section-30-exemption';
    case 'Private Unlimited':
    case 'Private Unlimited Company':
      return 'private-unlimited';
    case 'Protected Cell Company':
      return 'protected-cell-company';
    case 'Public Limited Company':
      return 'plc';
    case 'Registered Society':
      return 'registered-society-non-jurisdictional';
    case 'Royal Charter Company':
      return 'royal-charter';
    case 'Scottish Charitable Incorporated Organisation':
      return 'scottish-charitable-incorporated-organisation';
    case 'Scottish Partnership':
      return 'scottish-partnership';
    case 'United Kingdom Economic Interest Grouping':
      return 'ukeig';
    case 'United Kingdom Societas':
      return 'united-kingdom-societas';
  }
};
