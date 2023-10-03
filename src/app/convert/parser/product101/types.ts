import { CompanyRecord } from '../product183/types.js';

type GazettableDocumentTypeCompanyGroupCode =
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

type GazettableDocumentTypeLLPGroupCode =
  | 'Certificates' // A
  | 'Incorporation' // B
  | 'Members' // C
  | 'Accounts and Returns' // D
  | 'Registered Office' // E
  | 'Winding Up' // F
  | 'Restoration'; // G

type GazettableDocumentTypeSEGroupCode =
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

export type TransactionLine = Pick<
  CompanyRecord,
  | 'companyNumber'
  | 'dateOfIncorporation'
  | 'companyStatus'
  | 'jurisdiction'
  | 'name'
  | 'alphaKey'
  | 'accountingReferenceDate.day'
  | 'accountingReferenceDate.month'
  | 'accountsMadeUpDate'
  | 'accountsType'
  | 'inspectMarker'
  | 'privateFundIndicator'
  | 'confirmationStatementDate'
  | 'companyNumberConvertedTo'
  | 'address.careOf'
  | 'address.houseNameOrNumber'
  | 'address.street'
  | 'address.area'
  | 'address.postTown'
  | 'address.region'
  | 'address.postcode'
  | 'address.country'
  | 'address.poBox'
  | 'address.suppliedCompanyName'
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

export type Transaction =
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

type BaseTransaction<
  Fixed extends Partial<TransactionLine>,
  Required extends keyof TransactionLine = never,
  Optional extends keyof TransactionLine = never,
> = Pick<
  TransactionLine,
  'companyNumber' | 'receivedDate' | 'transactionId' | 'jurisdiction'
> &
  Pick<TransactionLine, Required> &
  Partial<Pick<TransactionLine, Optional>> &
  Fixed;

type NewIncorporationTransaction = BaseTransaction<
  {
    transactionType: 'New Incorporation';
    correctionMarker: '';
  },
  | 'gazettableDocumentType'
  | 'dateOfIncorporation'
  | 'gazetteDate'
  | 'companyStatus'
  | 'postcode'
  | 'postcodeStatus'
  | 'name'
  | 'alphaKey'
  | 'address.houseNameOrNumber'
  | 'address.careOf'
  | 'address.houseNameOrNumber'
  | 'address.street'
  | 'address.area'
  | 'address.postTown'
  | 'address.region'
  | 'address.postcode'
  | 'address.country'
  | 'address.poBox'
  | 'address.suppliedCompanyName',
  'accountingReferenceDate.day' | 'accountingReferenceDate.month'
>;

type AddRecordTransaction = BaseTransaction<
  {
    transactionType: 'Add Record';
    correctionMarker: '';
  },
  | 'dateOfIncorporation'
  | 'companyStatus'
  | 'postcode'
  | 'postcodeStatus'
  | 'name'
  | 'alphaKey'
  | 'address.houseNameOrNumber'
  | 'address.careOf'
  | 'address.houseNameOrNumber'
  | 'address.street'
  | 'address.area'
  | 'address.postTown'
  | 'address.region'
  | 'address.postcode'
  | 'address.country'
  | 'address.poBox'
  | 'address.suppliedCompanyName',
  | 'gazettableDocumentType'
  | 'accountsMadeUpDate'
  | 'confirmationStatementDate'
  | 'accountingReferenceDate.day'
  | 'accountingReferenceDate.month'
  | 'accountsType'
  | 'inspectMarker'
>;

type RestorationTransaction = BaseTransaction<
  {
    transactionType: 'Restoration';
    dissolvedMarker: 'Restored';
  },
  | 'correctionMarker'
  | 'gazettableDocumentType'
  | 'gazetteDate'
  | 'companyStatus'
  | 'postcode'
  | 'postcodeStatus'
  | 'name'
  | 'alphaKey'
  | 'address.houseNameOrNumber'
  | 'address.careOf'
  | 'address.houseNameOrNumber'
  | 'address.street'
  | 'address.area'
  | 'address.postTown'
  | 'address.region'
  | 'address.postcode'
  | 'address.country'
  | 'address.poBox'
  | 'address.suppliedCompanyName',
  | 'correctionMarker'
  | 'accountsMadeUpDate'
  | 'accountingReferenceDate.day'
  | 'accountingReferenceDate.month'
  | 'accountsType'
  | 'inspectMarker'
>;

type StatusTransaction = BaseTransaction<
  {
    transactionType: 'Status';
  },
  'correctionMarker' | 'gazettableDocumentType' | 'companyStatus',
  'gazetteDate'
>;

type AccountsMadeUpDateTransaction = BaseTransaction<
  {
    transactionType: 'Accounts Made Up Date';
  },
  | 'correctionMarker'
  | 'gazettableDocumentType'
  | 'accountsMadeUpDate'
  | 'accountsType',
  'gazetteDate'
>;

type AnnualReturnMadeUpDateTransaction = BaseTransaction<
  {
    transactionType: 'Annual Return Made Up Date';
  },
  'correctionMarker' | 'gazettableDocumentType' | 'confirmationStatementDate'
>;

type AccountingReferenceDateTransaction = BaseTransaction<
  {
    transactionType: 'Accounting Reference Date';
  },
  | 'correctionMarker'
  | 'accountingReferenceDate.day'
  | 'accountingReferenceDate.month'
>;

type NameTransaction = BaseTransaction<
  {
    transactionType: 'Name';
  },
  'correctionMarker' | 'name' | 'alphaKey',
  'gazettableDocumentType' | 'gazetteDate'
>;

type AddressTransaction = BaseTransaction<
  {
    transactionType: 'Address';
  },
  | 'correctionMarker'
  | 'postcode'
  | 'postcodeStatus'
  | 'address.houseNameOrNumber'
  | 'address.careOf'
  | 'address.houseNameOrNumber'
  | 'address.street'
  | 'address.area'
  | 'address.postTown'
  | 'address.region'
  | 'address.postcode'
  | 'address.country'
  | 'address.poBox'
  | 'address.suppliedCompanyName',
  'gazettableDocumentType' | 'gazetteDate'
>;

type NoLongerUsedTransaction = {
  transactionType: 'No Longer Used';
};

type AmendedAccountTransaction = BaseTransaction<
  {
    transactionType: 'Amended Account';
  },
  'correctionMarker' | 'accountsMadeUpDate' | 'accountsType'
>;

type VoluntaryArrangementTransaction = BaseTransaction<
  {
    transactionType: 'Voluntary Arrangement';
  },
  'correctionMarker'
>;

type DateOfIncorporationTransaction = BaseTransaction<
  {
    transactionType: 'Date of Incorporation';
    correctionMarker: 'Companies House Correction';
  },
  'dateOfIncorporation'
>;

type InspectMarkerTransaction = BaseTransaction<
  {
    transactionType: 'Inspect Marker';
  },
  'correctionMarker' | 'inspectMarker'
>;

type GazettableDocumentTypeNotOtherwiseIncludedTransaction = BaseTransaction<
  {
    transactionType: 'Gazettable Document Type Not Otherwise Included';
  },
  'correctionMarker' | 'gazettableDocumentType' | 'gazetteDate'
>;

type ConvertedClosedTransaction = BaseTransaction<
  {
    transactionType: 'Converted/Closed';
  },
  'correctionMarker'
>;

type DissolutionFirstGazetteTransaction = BaseTransaction<
  {
    transactionType: 'Dissolution First Gazette';
  },
  'correctionMarker' | 'gazettableDocumentType' | 'gazetteDate'
>;

type DissolutionFinalGazetteTransaction = BaseTransaction<
  {
    transactionType: 'Dissolution/Dissolution Final Gazette';
    dissolvedMarker: 'Dissolved';
  },
  'correctionMarker' | 'gazettableDocumentType' | 'gazetteDate'
>;

type DeleteTransaction = BaseTransaction<{
  transactionType: 'Delete';
  correctionMarker: '';
}>;

type SICCodesTransaction = BaseTransaction<
  {
    transactionType: 'SIC Codes';
  },
  'correctionMarker',
  'sicCodes.0' | 'sicCodes.1' | 'sicCodes.2' | 'sicCodes.3'
>;

type CountryOfOriginCodeTransaction = BaseTransaction<
  {
    transactionType: 'Country of Origin Code';
  },
  'correctionMarker' | 'countryOfOriginCode'
>;

type FullMembersListTransaction = BaseTransaction<
  {
    transactionType: 'Full Members List';
  },
  'correctionMarker' | 'confirmationStatementDate'
>;

type VoluntaryDissolutionIndicatorTransaction = BaseTransaction<
  {
    transactionType: 'Voluntary Dissolution Indicator';
  },
  'correctionMarker' | 'voluntaryDissolutionIndicator'
>;

type ConversionBetweenPLCAndSETransaction = BaseTransaction<
  {
    transactionType: 'Conversion from PLC to SE or from SE to PLC';
  },
  'correctionMarker' | 'companyNumberConvertedTo' | 'inspectMarker'
>;

type GazettableDocumentsSubmittedBySubsidiaryTransaction = BaseTransaction<
  {
    transactionType: 'Gazettable Documents Submitted by Subsidiary Company Claiming Exemption from Audit or Filing of Accounts';
  },
  | 'correctionMarker'
  | 'gazettableDocumentType'
  | 'accountsMadeUpDate'
  | 'gazetteDate'
>;

type SubsidiaryCompanyExemptionFromAuditOrFilingAccountsTransaction =
  BaseTransaction<
    {
      transactionType: 'Subsidiary Company Exemption from Audit or Filing of Accounts';
    },
    'correctionMarker' | 'accountsMadeUpDate',
    'accountsType'
  >;

type ChangeInJurisdictionTransaction = BaseTransaction<
  {
    transactionType: 'Change in Jurisdiction';
  },
  'correctionMarker' | 'gazetteDate'
>;

type ConfirmationStatementDateTransaction = BaseTransaction<
  {
    transactionType: 'Confirmation Statement Date';
  },
  | 'correctionMarker'
  | 'gazettableDocumentType'
  | 'confirmationStatementDate'
  | 'withUpdatesIndicator'
>;

type DesignationAsPrivateFundLimitedPartnershipTransaction = BaseTransaction<
  {
    transactionType: 'Designation as Private Fund Limited Partnership';
  },
  'privateFundIndicator'
>;
