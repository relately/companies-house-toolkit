import { Product183Record } from '../../product183/parser/types.js';

export type GazettableDocumentTypeCompanyGroupCode =
  | 'Certificates' // A
  | 'Constitutional Documents' // B
  | 'Directors' // C
  | 'Accounts, Reports and Returns' // D
  | 'Registered Office' // E
  | 'Winding Up' // F
  | 'Public Companies - Share Capital' // G
  | 'Mergers and Divisions' // H
  | 'Private Companies re-registering as Public only' // J
  | 'Overseas Companies' // K
  | 'Restoration' // L
  | 'Dissolution First Gazette' // 1
  | 'Dissolution Final Gazette'; // 2

export type GazettableDocumentTypeLLPGroupCode =
  | 'Certificates' // A
  | 'Incorporation' // B
  | 'Members' // C
  | 'Accounts and Returns' // D
  | 'Registered Office' // E
  | 'Winding Up' // F
  | 'Restoration'; // G

export type GazettableDocumentTypeSEGroupCode =
  | 'Company Registration' // A
  | 'Statuses' // B
  | 'Members' // C
  | 'Accounts and Returns' // D
  | 'Registered Office' // E
  | 'Winding Up' // F
  | 'Share Capital' // G
  | 'Mergers and Divisions' // H
  | 'Restoration' // L
  | 'Transfer of an SE out of the UK' // M
  | 'Deletion of Company or SE' // N
  | 'Dissolution First Gazette' // 1
  | 'Dissolution Final Gazette'; // 2

export type CorrectionMarker =
  | '' // 0 (we use an empty string to represent 'Not a correction')
  | 'Companies House Correction' // 9
  | 'Errored Transaction'; // 1

export type VoluntaryDissolutionIndicator =
  | 'Application'
  | 'Withdrawal'
  | 'Discontinuance'
  | 'Suspension';

export type DissolvedMarker = 'Dissolved' | 'Restored';

export type Product101Record = Pick<
  Product183Record,
  | 'companyNumber'
  | 'dateOfIncorporation'
  | 'companyStatus'
  | 'jurisdiction'
  | 'name'
  | 'alphaKey'
  | 'accountingReferenceDate'
  | 'accountsMadeUpDate'
  | 'accountsType'
  | 'inspectMarker'
  | 'privateFundIndicator'
  | 'confirmationStatementDate'
  | 'companyNumberConvertedTo'
  | 'address'
  | 'postcode'
  | 'postcodeStatus'
  | 'poBox'
> & {
  transactionType: string;
  correctionMarker: CorrectionMarker | '';
  gazettableDocumentType: string;
  originalGazettableDocumentType: string;
  countryOfOriginCode: string;
  gazetteDate: string;
  originalDateOfPublication: string;
  voluntaryDissolutionIndicator: VoluntaryDissolutionIndicator | '';
  dissolvedMarker: DissolvedMarker | '';
  receivedDate: string;
  'sicCodes.0': string;
  'sicCodes.1': string;
  'sicCodes.2': string;
  'sicCodes.3': string;
  withUpdatesIndicator: boolean;
  transactionId: string;
};

export type Product101Transaction =
  | NewIncorporationTransaction
  | AddRecordTransaction
  | RestorationTransaction
  | StatusTransaction
  | AccountsMadeUpDateTransaction
  | AnnualReturnMadeUpDateTransaction
  | AccountingReferenceDateTransaction
  | NameTransaction
  | AddressTransaction
  | NoLongerUsedTransaction
  | AmendedAccountTransaction
  | VoluntaryArrangementTransaction
  | DateOfIncorporationTransaction
  | InspectMarkerTransaction
  | GazettableDocumentTypeNotOtherwiseIncludedTransaction
  | ConvertedClosedTransaction
  | DissolutionFirstGazetteTransaction
  | DissolutionFinalGazetteTransaction
  | DeleteTransaction
  | SICCodesTransaction
  | CountryOfOriginCodeTransaction
  | FullMembersListTransaction
  | VoluntaryDissolutionIndicatorTransaction
  | ConversionBetweenPLCAndSETransaction
  | GazettableDocumentsSubmittedBySubsidiaryTransaction
  | SubsidiaryCompanyExemptionFromAuditOrFilingAccountsTransaction
  | ChangeInJurisdictionTransaction
  | ConfirmationStatementDateTransaction
  | DesignationAsPrivateFundLimitedPartnershipTransaction;

type BaseTransaction = Pick<
  Product101Record,
  'companyNumber' | 'receivedDate' | 'transactionId' | 'jurisdiction'
>;

type NewIncorporationTransaction = {
  transactionType: 'New Incorporation';
  correctionMarker: '';
} & BaseTransaction &
  Pick<
    Product101Record,
    | 'address'
    | 'alphaKey'
    | 'companyStatus'
    | 'dateOfIncorporation'
    | 'gazettableDocumentType'
    | 'gazetteDate'
    | 'name'
    | 'postcode'
    | 'postcodeStatus'
  > &
  Partial<Pick<Product101Record, 'accountingReferenceDate'>>;

type AddRecordTransaction = {
  transactionType: 'Add Record';
  correctionMarker: '';
} & BaseTransaction &
  Pick<
    Product101Record,
    | 'accountingReferenceDate'
    | 'accountsMadeUpDate'
    | 'accountsType'
    | 'address'
    | 'alphaKey'
    | 'companyStatus'
    | 'confirmationStatementDate'
    | 'dateOfIncorporation'
    | 'gazettableDocumentType'
    | 'inspectMarker'
    | 'name'
    | 'postcode'
    | 'postcodeStatus'
  >;

type RestorationTransaction = {
  transactionType: 'Restoration';
  dissolvedMarker: 'Restored';
} & BaseTransaction &
  Pick<
    Product101Record,
    | 'accountingReferenceDate'
    | 'accountsMadeUpDate'
    | 'accountsType'
    | 'address'
    | 'alphaKey'
    | 'companyStatus'
    | 'confirmationStatementDate'
    | 'correctionMarker'
    | 'dateOfIncorporation'
    | 'gazettableDocumentType'
    | 'gazetteDate'
    | 'inspectMarker'
    | 'name'
    | 'postcode'
    | 'postcodeStatus'
  >;

type StatusTransaction = {
  transactionType: 'Status';
} & BaseTransaction &
  Pick<
    Product101Record,
    'correctionMarker' | 'gazettableDocumentType' | 'companyStatus'
  > &
  Partial<Pick<Product101Record, 'gazetteDate'>>;

type AccountsMadeUpDateTransaction = {
  transactionType: 'Accounts Made Up Date';
} & BaseTransaction &
  Pick<
    Product101Record,
    | 'accountsMadeUpDate'
    | 'accountsType'
    | 'correctionMarker'
    | 'gazettableDocumentType'
  > &
  Partial<Pick<Product101Record, 'gazetteDate'>>;

type AnnualReturnMadeUpDateTransaction = {
  transactionType: 'Annual Return Made Up Date';
} & BaseTransaction &
  Pick<
    Product101Record,
    'correctionMarker' | 'gazettableDocumentType' | 'confirmationStatementDate'
  >;

type AccountingReferenceDateTransaction = {
  transactionType: 'Accounting Reference Date';
} & BaseTransaction &
  Pick<Product101Record, 'correctionMarker' | 'accountingReferenceDate'>;

type NameTransaction = {
  transactionType: 'Name';
} & BaseTransaction &
  Pick<Product101Record, 'correctionMarker' | 'name' | 'alphaKey'> &
  Partial<Pick<Product101Record, 'gazettableDocumentType' | 'gazetteDate'>>;

type AddressTransaction = {
  transactionType: 'Address';
} & BaseTransaction &
  Pick<
    Product101Record,
    'correctionMarker' | 'postcode' | 'postcodeStatus' | 'address'
  > &
  Partial<Pick<Product101Record, 'gazettableDocumentType' | 'gazetteDate'>>;

type NoLongerUsedTransaction = {
  transactionType: 'No Longer Used';
} & BaseTransaction;

type AmendedAccountTransaction = {
  transactionType: 'Amended Account';
} & BaseTransaction &
  Pick<
    Product101Record,
    'correctionMarker' | 'accountsMadeUpDate' | 'accountsType'
  >;

type VoluntaryArrangementTransaction = {
  transactionType: 'Voluntary Arrangement';
} & BaseTransaction &
  Pick<Product101Record, 'correctionMarker'>;

type DateOfIncorporationTransaction = {
  transactionType: 'Date of Incorporation';
  correctionMarker: 'Companies House Correction';
} & BaseTransaction &
  Pick<Product101Record, 'dateOfIncorporation'>;

type InspectMarkerTransaction = {
  transactionType: 'Inspect Marker';
} & BaseTransaction &
  Pick<Product101Record, 'correctionMarker' | 'inspectMarker'>;

type GazettableDocumentTypeNotOtherwiseIncludedTransaction = {
  transactionType: 'Gazettable Document Type Not Otherwise Included';
} & BaseTransaction &
  Pick<
    Product101Record,
    'correctionMarker' | 'gazettableDocumentType' | 'gazetteDate'
  >;

type ConvertedClosedTransaction = {
  transactionType: 'Converted/Closed';
} & BaseTransaction &
  Pick<Product101Record, 'correctionMarker'>;

type DissolutionFirstGazetteTransaction = {
  transactionType: 'Dissolution First Gazette';
} & BaseTransaction &
  Pick<
    Product101Record,
    'correctionMarker' | 'gazettableDocumentType' | 'gazetteDate'
  >;

type DissolutionFinalGazetteTransaction = {
  transactionType: 'Dissolution/Dissolution Final Gazette';
  dissolvedMarker: 'Dissolved';
} & BaseTransaction &
  Pick<
    Product101Record,
    'correctionMarker' | 'gazettableDocumentType' | 'gazetteDate'
  >;

type DeleteTransaction = {
  transactionType: 'Delete';
  correctionMarker: '';
} & BaseTransaction;

type SICCodesTransaction = {
  transactionType: 'SIC Codes';
} & BaseTransaction &
  Pick<Product101Record, 'correctionMarker'> &
  Partial<
    Pick<
      Product101Record,
      'sicCodes.0' | 'sicCodes.1' | 'sicCodes.2' | 'sicCodes.3'
    >
  >;

type CountryOfOriginCodeTransaction = {
  transactionType: 'Country of Origin Code';
} & BaseTransaction &
  Pick<Product101Record, 'correctionMarker' | 'countryOfOriginCode'>;

type FullMembersListTransaction = {
  transactionType: 'Full Members List';
} & BaseTransaction &
  Pick<Product101Record, 'correctionMarker' | 'confirmationStatementDate'>;

type VoluntaryDissolutionIndicatorTransaction = {
  transactionType: 'Voluntary Dissolution Indicator';
} & BaseTransaction &
  Pick<Product101Record, 'correctionMarker' | 'voluntaryDissolutionIndicator'>;

type ConversionBetweenPLCAndSETransaction = {
  transactionType: 'Conversion from PLC to SE or from SE to PLC';
} & BaseTransaction &
  Pick<
    Product101Record,
    'correctionMarker' | 'companyNumberConvertedTo' | 'inspectMarker'
  >;

type GazettableDocumentsSubmittedBySubsidiaryTransaction = {
  transactionType: 'Gazettable Documents Submitted by Subsidiary Company Claiming Exemption from Audit or Filing of Accounts';
} & BaseTransaction &
  Pick<
    Product101Record,
    | 'correctionMarker'
    | 'gazettableDocumentType'
    | 'accountsMadeUpDate'
    | 'gazetteDate'
  >;

type SubsidiaryCompanyExemptionFromAuditOrFilingAccountsTransaction = {
  transactionType: 'Subsidiary Company Exemption from Audit or Filing of Accounts';
} & BaseTransaction &
  Pick<Product101Record, 'correctionMarker' | 'accountsMadeUpDate'> &
  Partial<Pick<Product101Record, 'accountsType'>>;

type ChangeInJurisdictionTransaction = {
  transactionType: 'Change in Jurisdiction';
} & BaseTransaction &
  Pick<Product101Record, 'correctionMarker' | 'gazetteDate'>;

type ConfirmationStatementDateTransaction = {
  transactionType: 'Confirmation Statement Date';
} & BaseTransaction &
  Pick<
    Product101Record,
    | 'correctionMarker'
    | 'gazettableDocumentType'
    | 'confirmationStatementDate'
    | 'withUpdatesIndicator'
  >;

type DesignationAsPrivateFundLimitedPartnershipTransaction = {
  transactionType: 'Designation as Private Fund Limited Partnership';
} & BaseTransaction &
  Pick<Product101Record, 'privateFundIndicator'>;
