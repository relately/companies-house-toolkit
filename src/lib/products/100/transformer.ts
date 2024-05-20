import { convertToTitleCase } from '../../util/strings.js';
import {
  transformProduct183Accounts,
  transformProduct183CompanyStatus,
  transformProduct183CompanyStatusDetail,
  transformProduct183ConfirmationStatement,
  transformProduct183Jurisdiction,
  transformProduct183Type,
} from '../183/transformer.js';
import { Product183Company } from '../183/transformer/types.js';

import {
  AddRecordTransaction,
  AddressTransaction,
  NewIncorporationTransaction,
  Product100Transaction,
  RestorationTransaction,
} from './parser/types.js';
import { CompanyTransaction } from './transformer/types.js';

export const transformProduct100 = (
  record: Product100Transaction
): CompanyTransaction => {
  switch (record.transactionType) {
    case 'New Incorporation':
      return {
        type: 'incorporation',
        ...transformCommonFields(record),
        gazette: {
          document_type: record.gazettableDocumentType,
          date: record.gazetteDate,
        },
        data: {
          accounts: transformProduct183Accounts(record),
          company_name: record.name,
          company_number: record.companyNumber,
          date_of_creation: record.dateOfIncorporation,
          registered_office_address:
            transformProduct100RegisteredOfficeAddress(record),
          type: transformProduct183Type(
            record.companyStatus,
            record.companyNumber
          ),
        },
      };
    case 'Add Record':
      return {
        type: 'add',
        ...transformCommonFields(record),
        gazette: {
          document_type: record.gazettableDocumentType,
        },
        data: {
          accounts: transformProduct183Accounts(record),
          company_name: record.name,
          company_number: record.companyNumber,
          company_status: transformProduct183CompanyStatus(
            record.inspectMarker
          ),
          company_status_detail: transformProduct183CompanyStatusDetail(
            record.inspectMarker
          ),
          ...transformProduct183ConfirmationStatement(
            record['confirmationStatementDate']
          ),
          date_of_creation: record.dateOfIncorporation,
          registered_office_address:
            transformProduct100RegisteredOfficeAddress(record),
          type: transformProduct183Type(
            record.companyStatus,
            record.companyNumber
          ),
        },
      };
    case 'Restoration':
      return {
        type: 'restoration',
        ...transformCommonFields(record),
        gazette: {
          document_type: record.gazettableDocumentType,
          date: record.gazetteDate,
        },
        data: {
          accounts: transformProduct183Accounts(record),
          company_number: record.companyNumber,
          company_name: record.name,
          company_status: transformProduct183CompanyStatus(
            record.inspectMarker
          ),
          company_status_detail: transformProduct183CompanyStatusDetail(
            record.inspectMarker
          ),
          ...transformProduct183ConfirmationStatement(
            record['confirmationStatementDate']
          ),
          date_of_creation: record.dateOfIncorporation,
          registered_office_address:
            transformProduct100RegisteredOfficeAddress(record),
          type: transformProduct183Type(
            record.companyStatus,
            record.companyNumber
          ),
        },
      };
    case 'Status':
      return {
        type: 'type',
        ...transformCommonFields(record),
        gazette: {
          document_type: record.gazettableDocumentType,
        },
        data: {
          type: transformProduct183Type(
            record.companyStatus,
            record.companyNumber
          ),
        },
      };
    case 'Accounts Made Up Date':
      return {
        type: 'accounts-made-up-date',
        ...transformCommonFields(record),
        gazette: {
          date: record.gazetteDate,
          document_type: record.gazettableDocumentType,
        },
        data: {
          accounts: transformProduct183Accounts(record),
        },
      };
    case 'Annual Return Made Up Date':
      return {
        type: 'confirmation-statement-made-up-date',
        ...transformCommonFields(record),
        gazette: {
          document_type: record.gazettableDocumentType,
        },
        data: {
          ...transformProduct183ConfirmationStatement(
            record['confirmationStatementDate']
          ),
        },
      };
    case 'Accounting Reference Date':
      return {
        type: 'accounting-reference-date',
        ...transformCommonFields(record),
        data: {
          accounts: transformProduct183Accounts(record),
        },
      };
    case 'Name':
      return {
        type: 'name',
        ...transformCommonFields(record),
        gazette: {
          document_type: record.gazettableDocumentType,
          date: record.gazetteDate,
        },
        data: {
          company_name: record.name,
        },
      };
    case 'Address':
      return {
        type: 'address',
        ...transformCommonFields(record),
        gazette: {
          document_type: record.gazettableDocumentType,
          date: record.gazetteDate,
        },
        data: {
          registered_office_address:
            transformProduct100RegisteredOfficeAddress(record),
        },
      };
    case 'No Longer Used':
      return {
        ...transformCommonFields(record),
        type: 'no-longer-used',
      };
    case 'Amended Account':
      return {
        type: 'accounts',
        ...transformCommonFields(record),
        data: {
          accounts: transformProduct183Accounts(record),
        },
      };
    case 'Voluntary Arrangement':
      return {
        type: 'voluntary-arrangement',
        ...transformCommonFields(record),
        data: {
          company_status: 'voluntary-arrangement',
        },
      };
    case 'Date of Incorporation':
      return {
        type: 'date-of-incorporation',
        ...transformCommonFields(record),
        data: {
          date_of_creation: record.dateOfIncorporation,
        },
      };
    case 'Inspect Marker':
      return {
        type: 'inspect-marker',
        ...transformCommonFields(record),
        data: {
          company_status: transformProduct183CompanyStatus(
            record['inspectMarker']
          ),
          company_status_detail: transformProduct183CompanyStatusDetail(
            record['inspectMarker']
          ),
        },
      };
    case 'Gazettable Document Type Not Otherwise Included':
      return {
        type: 'gazettable-document-type-not-otherwise-included',
        ...transformCommonFields(record),
        gazette: {
          document_type: record.gazettableDocumentType,
          date: record.gazetteDate,
        },
      };
    case 'Converted/Closed':
      return {
        type: 'converted-closed',
        ...transformCommonFields(record),
        data: {
          company_status: 'converted-closed',
        },
      };
    case 'Dissolution First Gazette':
      return {
        type: 'dissolution-first-gazette',
        ...transformCommonFields(record),
        gazette: {
          document_type: record.gazettableDocumentType,
          date: record.gazetteDate,
        },
      };
    case 'Dissolution/Dissolution Final Gazette':
      return {
        type: 'dissolution',
        ...transformCommonFields(record),
        gazette: {
          document_type: record.gazettableDocumentType,
          date: record.gazetteDate,
        },
        data: {
          company_status: 'dissolved',
        },
      };
    case 'Delete':
      return {
        type: 'delete',
        ...transformCommonFields(record),
      };
    case 'SIC Codes':
      return {
        type: 'sic-codes',
        ...transformCommonFields(record),
        data: {
          sic_codes: [
            record['sicCodes.0'],
            record['sicCodes.1'],
            record['sicCodes.2'],
            record['sicCodes.3'],
          ].filter(Boolean) as string[],
        },
      };
    case 'Country of Origin Code':
      return {
        type: 'country-of-origin-code',
        ...transformCommonFields(record),
      };
    case 'Full Members List':
      return {
        type: 'full-members-list',
        ...transformCommonFields(record),
        data: {
          ...transformProduct183ConfirmationStatement(
            record['confirmationStatementDate']
          ),
        },
      };
    case 'Voluntary Dissolution Indicator':
      return {
        type: 'voluntary-dissolution-indicator',
        ...transformCommonFields(record),
      };
    case 'Conversion from PLC to SE or from SE to PLC':
      return {
        type: 'conversion-between-plc-and-se',
        ...transformCommonFields(record),
        data: {
          company_status_detail:
            record['inspectMarker'] === 'Actual conversion from PLC to SE'
              ? 'transformed-to-se'
              : 'converted-to-plc',
        },
      };
    case 'Gazettable Documents Submitted by Subsidiary Company Claiming Exemption from Audit or Filing of Accounts':
      return {
        type: 'gazettable-documents-submitted-by-subsidiary',
        ...transformCommonFields(record),
        gazette: {
          document_type: record.gazettableDocumentType,
          date: record.gazetteDate,
        },
        data: {
          accounts: transformProduct183Accounts(record),
        },
      };
    case 'Subsidiary Company Exemption from Audit or Filing of Accounts':
      return {
        type: 'subsidiary-company-exemption-from-audit-or-filing-accounts',
        ...transformCommonFields(record),
        data: {
          accounts: transformProduct183Accounts(record),
        },
      };
    case 'Change in Jurisdiction':
      return {
        type: 'jurisdiction',
        ...transformCommonFields(record),
        gazette: {
          date: record.gazetteDate,
        },
        data: {
          jurisdiction: transformProduct183Jurisdiction(record['jurisdiction']),
        },
      };
    case 'Confirmation Statement Date':
      return {
        type: 'confirmation-statement-date',
        ...transformCommonFields(record),
        gazette: {
          document_type: record.gazettableDocumentType,
        },
        data: {
          ...transformProduct183ConfirmationStatement(
            record['confirmationStatementDate']
          ),
        },
      };
    case 'Designation as Private Fund Limited Partnership':
      return {
        type: 'designation-as-private-fund-limited-partnership',
        ...transformCommonFields(record),
        data: {
          subtype: 'private-fund-limited-partnership',
        },
      };
  }
};

const transformCommonFields = (
  record: Product100Transaction
): Pick<
  CompanyTransaction,
  'transaction_id' | 'received_date' | 'company_number' | 'jurisdiction'
> => ({
  transaction_id: record.transactionId,
  received_date: record.receivedDate,
  company_number: record.companyNumber,
  jurisdiction: transformProduct183Jurisdiction(record.jurisdiction),
});

export const transformProduct100RegisteredOfficeAddress = (
  record:
    | AddressTransaction
    | NewIncorporationTransaction
    | AddRecordTransaction
    | RestorationTransaction
): Product183Company['registered_office_address'] => {
  return {
    care_of: convertToTitleCase(record.address.careOf),
    po_box: convertToTitleCase(record.address.poBox),
    address_line_1: convertToTitleCase(record.address.addressLine1),
    address_line_2: convertToTitleCase(record.address.addressLine2),
    locality: convertToTitleCase(record.address.addressLine3),
    region: convertToTitleCase(record.address.addressLine4),
    postal_code: record.postcode,
  };
};
