import { CompanyAccountsType } from '../../types/company.js';
import { removeEmptyValues } from '../../util/objects.js';
import { convertToTitleCase } from '../../util/strings.js';
import { Product183Record } from './parser/types.js';
import { Product183Company } from './transformer/types.js';

export const transformProduct183 = (
  record: Product183Record
): Product183Company => {
  return {
    accounts: transformProduct183Accounts(record),
    company_number: record.companyNumber,
    company_name: record.name,
    company_status: transformProduct183CompanyStatus(record.inspectMarker),
    company_status_detail: transformProduct183CompanyStatusDetail(
      record.inspectMarker
    ),
    ...transformProduct183ConfirmationStatement(
      record.confirmationStatementDate
    ),
    date_of_creation: record.dateOfIncorporation,
    jurisdiction: transformProduct183Jurisdiction(record.jurisdiction),
    links: {
      self: `/company/${record.companyNumber}`,
    },
    registered_office_address: transformProduct183RegisteredOfficeAddress(
      record.address
    ),
    type: transformProduct183Type(
      record['companyStatus'],
      record['companyNumber']
    ),
    subtype: transformProduct183Subtype(record['privateFundIndicator']),
  };
};

export const transformProduct183Accounts = (record: {
  accountingReferenceDate?: Product183Record['accountingReferenceDate'];
  accountsMadeUpDate?: Product183Record['accountsMadeUpDate'];
  accountsType?: Product183Record['accountsType'];
  dateOfIncorporation?: Product183Record['dateOfIncorporation'];
}): Product183Company['accounts'] => {
  const accountingReferenceDay =
    record.accountingReferenceDate &&
    record.accountingReferenceDate?.day?.length > 0
      ? parseInt(record.accountingReferenceDate.day)
      : undefined;
  const accountingReferenceMonth =
    record.accountingReferenceDate &&
    record.accountingReferenceDate.month.length > 0
      ? parseInt(record.accountingReferenceDate.month)
      : undefined;

  return removeEmptyValues({
    accounting_reference_date: {
      day: accountingReferenceDay,
      month: accountingReferenceMonth,
    },
    last_accounts: {
      made_up_to: record.accountsMadeUpDate,
      type: record.accountsType
        ? transformAccountsType(record.accountsType)
        : undefined,
    },
  });
};

const transformAccountsType = (
  type: Product183Record['accountsType']
): CompanyAccountsType | undefined => {
  switch (type) {
    case 'Audit Exemption Subsidiary':
      return 'audit-exemption-subsidiary';
    case 'Audited Abridged':
      return 'audited-abridged';
    case 'Dormant':
      return 'dormant';
    case 'Filing Exemption Subsidiary':
      return 'filing-exemption-subsidiary';
    case 'Full Accounts':
      return 'full';
    case 'Group':
      return 'group';
    case 'Initial':
      return 'initial';
    case 'Interim':
      return 'interim';
    case 'Medium Company':
      return 'medium';
    case 'Micro-entity accounts':
      return 'micro-entity';
    case 'Partial Exemption':
      return 'partial-exemption';
    case 'Small Abbreviated':
      return 'small';
    case 'Total Exemption Full':
      return 'total-exemption-full';
    case 'Total Exemption Small Abbreviated':
      return 'total-exemption-small';
    case 'Unaudited Abridged':
      return 'unaudited-abridged';
    case 'Type Not Available':
    default:
      return undefined;
  }
};

export const transformProduct183CompanyStatus = (
  inspectMarker: Product183Record['inspectMarker']
): Product183Company['company_status'] | undefined => {
  switch (inspectMarker) {
    case 'Liquidation':
      return 'liquidation';
    case 'Receivership':
      return 'receivership';
    case 'Actual conversion from PLC to SE':
    case 'Actual conversion from SE to PLC':
    case 'General Inspect Marker':
    case 'Inspection no longer specifically advised':
    case 'Proposed conversion from SE to PLC':
    case 'Proposed conversion from PLC to SE':
    default:
      return undefined;
  }
};

export const transformProduct183CompanyStatusDetail = (
  inspectMarker: Product183Record['inspectMarker']
): Product183Company['company_status_detail'] | undefined => {
  switch (inspectMarker) {
    case 'Actual conversion from PLC to SE':
      return 'transformed-to-se';
    case 'Actual conversion from SE to PLC':
      return 'converted-to-plc';
    case 'Liquidation':
    case 'Receivership':
    case 'General Inspect Marker':
    case 'Inspection no longer specifically advised':
    case 'Proposed conversion from SE to PLC':
    case 'Proposed conversion from PLC to SE':
    default:
      return undefined;
  }
};

export const transformProduct183ConfirmationStatement = (
  confirmationStatementDate: Product183Record['confirmationStatementDate']
): Pick<
  Product183Company,
  'confirmation_statement' | 'last_full_members_list_date'
> => {
  if (confirmationStatementDate > '2016-06-29') {
    return {
      confirmation_statement: { last_made_up_to: confirmationStatementDate },
    };
  } else {
    return {
      last_full_members_list_date: confirmationStatementDate,
    };
  }
};

export const transformProduct183Jurisdiction = (
  jurisdiction: Product183Record['jurisdiction']
): Product183Company['jurisdiction'] | undefined => {
  switch (jurisdiction) {
    case 'England/Wales':
      return 'england-wales';
    case 'Wales':
      return 'wales';
    case 'Scotland':
      return 'scotland';
    case 'Northern Ireland':
      return 'northern-ireland';
    case 'European Union':
      return 'european-union';
    case 'UK':
      return 'united-kingdom';
    case 'England':
      return 'england';
    case 'Foreign (non-EU)':
      return 'noneu';
    case 'Non-Jurisdictional':
    default:
      return undefined;
  }
};

export const transformProduct183RegisteredOfficeAddress = (
  address: Product183Record['address']
): Product183Company['registered_office_address'] => {
  return {
    care_of: convertToTitleCase(address.careOf),
    premises: convertToTitleCase(address.houseNameOrNumber),
    po_box: convertToTitleCase(address.poBox),
    address_line_1: convertToTitleCase(address.street),
    address_line_2: convertToTitleCase(address.area),
    locality: convertToTitleCase(address.postTown),
    region: convertToTitleCase(address.region),
    country: convertToTitleCase(address.country),
    postal_code: address.postcode,
  };
};

export const transformProduct183Type = (
  companyStatus: Product183Record['companyStatus'],
  companyNumber: Product183Record['companyNumber']
): Product183Company['type'] | undefined => {
  switch (companyStatus) {
    case 'Company Converted / Closed':
      return 'converted-or-closed';
    case 'ICVC (Securities)':
      return 'icvc-securities';
    case 'ICVC (Warrant)':
      return 'icvc-warrant';
    case 'ICVC (Umbrella)':
      return 'icvc-umbrella';
    case 'Limited Partnership':
      return 'limited-partnership';
    case 'Notice of details of an insolvent Further Education Corporation or Sixth Form College':
      return 'further-education-or-sixth-form-college-corporation';
    case 'Old Public Company':
      return 'old-public-company';
    case 'Other':
      if (companyNumber.startsWith('OC')) {
        return 'llp';
      }

      return 'other';
    case 'PLC':
      return 'plc';
    case 'Private Company Limited by Guarantee Without Share Capital Claiming Exemption from using the word ‘LIMITED’':
      return 'private-limited-guarant-nsc-limited-exemption';
    case 'Private Company Limited by Shares Claiming Exemption from using the word ‘LIMITED’':
      return 'private-limited-shares-section-30-exemption';
    case 'Private Limited':
      return 'ltd';
    case 'Private Limited Company Without Share Capital':
      return 'private-limited-guarant-nsc';
    case 'Private Unlimited':
      return 'private-unlimited';
    case 'Private Unlimited Company Without Share Capital':
      return 'private-unlimited-nsc';
    case 'Protected Cell Company':
      return 'protected-cell-company';
    case 'Scottish Partnership':
      return 'scottish-partnership';
    case 'Societas Europaea (SE)':
      return 'european-public-limited-liability-company-se';
    default:
      return undefined;
  }
};

export const transformProduct183Subtype = (
  privateFundIndicator: Product183Record['privateFundIndicator']
): Product183Company['subtype'] => {
  if (
    privateFundIndicator ===
      'The Limited Partnership has been a private fund limited partnership since commencement' ||
    privateFundIndicator ===
      'Changed from a limited partnership to a private fund limited partnership'
  ) {
    return 'private-fund-limited-partnership';
  }
};
