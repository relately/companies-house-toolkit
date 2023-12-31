export type Product183LineType = 'header' | 'company' | 'trailer' | 'unknown';

export type Product183Header = {
  runNumber: number;
  fileProductionDate: string;
};

type AccountsType =
  | 'Type Not Available'
  | 'Full Accounts'
  | 'Small Abbreviated'
  | 'Medium Company'
  | 'Group'
  | 'Dormant'
  | 'Interim'
  | 'Initial'
  | 'Total Exemption Full'
  | 'Total Exemption Small Abbreviated'
  | 'Partial Exemption'
  | 'Audit Exemption Subsidiary'
  | 'Filing Exemption Subsidiary'
  | 'Micro-entity accounts'
  | 'Audited Abridged'
  | 'Unaudited Abridged';

type CompanyStatus =
  | 'Private Unlimited'
  | 'Private Limited'
  | 'PLC'
  | 'Old Public Company'
  | 'Private Company Limited by Guarantee Without Share Capital Claiming Exemption from using the word ‘LIMITED’'
  | 'Limited Partnership'
  | 'Private Limited Company Without Share Capital'
  | 'Company Converted / Closed'
  | 'Private Unlimited Company Without Share Capital'
  | 'Other'
  | 'Private Company Limited by Shares Claiming Exemption from using the word ‘LIMITED’'
  | 'Societas Europaea (SE)'
  | 'Scottish Partnership'
  | 'Protected Cell Company'
  | 'Notice of details of an insolvent Further Education Corporation or Sixth Form College'
  | 'ICVC (Securities)'
  | 'ICVC (Warrant)'
  | 'ICVC (Umbrella)';

type InspectMarker =
  | 'Liquidation'
  | 'Receivership'
  | 'Proposed conversion from PLC to SE'
  | 'Actual conversion from PLC to SE'
  | 'Proposed conversion from SE to PLC'
  | 'Actual conversion from SE to PLC'
  | 'Inspection no longer specifically advised'
  | 'General Inspect Marker';

type Jurisdiction =
  | 'England/Wales'
  | 'Wales'
  | 'Scotland'
  | 'Northern Ireland'
  | 'European Union'
  | 'UK'
  | 'England'
  | 'Foreign (non-EU)'
  | 'Non-Jurisdictional';

type PostcodeStatus =
  | 'Added by agent'
  | 'Amended by agent'
  | 'Returned to be verified'
  | "Added by initial agent's manual system"
  | 'Original address as provided by company'
  | 'Outward code only added by initial agent'
  | 'Deemed "unpostcodeable"'
  | 'Verified and correct for given address'
  | 'Address too long for postcode'
  | 'Amended original by automatic means'
  | 'Amended original by manual means';

type PrivateFundIndicator =
  | 'The Limited Partnership has been a private fund limited partnership since commencement'
  | 'Changed from a limited partnership to a private fund limited partnership'
  | 'Not a private fund limited partnership';

export type Product183Record = {
  accountingReferenceDate: {
    day: string;
    month: string;
  };
  accountsMadeUpDate: string;
  accountsType: AccountsType | '';
  alphaKey: string;
  confirmationStatementDate: string; // This was known as 'Annual Return Made Up Date' before June 2016
  companyNumber: string;
  companyStatus: CompanyStatus;
  dateOfIncorporation: string;
  inspectMarker: InspectMarker | '';
  privateFundIndicator: PrivateFundIndicator | '';
  companyNumberConvertedTo: string;
  jurisdiction: Jurisdiction;
  name: string;
  poBox: string;
  postcode: string; // The separate, possibly verified postcode
  postcodeStatus: PostcodeStatus;
  address: {
    careOf: string;
    houseNameOrNumber: string;
    street: string;
    area: string;
    postTown: string;
    region: string;
    postcode: string; // The postcode provided as part of the address
    country: string;
    poBox: string;
    suppliedCompanyName: string;
  };
};

export type Product183RecordVariableData = Pick<Product183Record, 'address'>;
