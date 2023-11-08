import {
  transformProduct183Accounts,
  transformProduct183CompanyStatus,
  transformProduct183CompanyStatusDetail,
  transformProduct183ConfirmationStatement,
  transformProduct183Jurisdiction,
  transformProduct183RegisteredOfficeAddress,
  transformProduct183Type,
} from '../product183/transformer.js';
import { parseIsoDate } from '../util/dates.js';
import { Product101Transaction } from './parser/types.js';
import { CompanyTransaction } from './transformer/types.js';

export const transformProduct101 = (
  record: Product101Transaction
): CompanyTransaction => {
  switch (record.transactionType) {
    case 'New Incorporation':
      return {
        type: 'incorporation',
        ...transformCommonFields(record),
        gazette: {
          document_type: record.gazettableDocumentType,
          date: parseIsoDate(record.gazetteDate),
        },
        data: {
          accounts: transformProduct183Accounts(record),
          company_name: record.name,
          company_number: record.companyNumber,
          date_of_creation: parseIsoDate(record.dateOfIncorporation),
          registered_office_address: transformProduct183RegisteredOfficeAddress(
            record.address
          ),
          type: transformProduct183Type(record.companyStatus),
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
          confirmation_statement: transformProduct183ConfirmationStatement(
            record['confirmationStatementDate']
          ),
          date_of_creation: parseIsoDate(record.dateOfIncorporation),
          registered_office_address: transformProduct183RegisteredOfficeAddress(
            record.address
          ),
          type: transformProduct183Type(record.companyStatus),
        },
      };
    case 'Restoration':
      return {
        type: 'restoration',
        ...transformCommonFields(record),
        gazette: {
          document_type: record.gazettableDocumentType,
          date: parseIsoDate(record.gazetteDate),
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
          confirmation_statement: transformProduct183ConfirmationStatement(
            record['confirmationStatementDate']
          ),
          date_of_creation: parseIsoDate(record.dateOfIncorporation),
          registered_office_address: transformProduct183RegisteredOfficeAddress(
            record.address
          ),
          type: transformProduct183Type(record.companyStatus),
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
          type: transformProduct183Type(record.companyStatus),
        },
      };
    case 'Accounts Made Up Date':
      return {
        type: 'accounts-made-up-date',
        ...transformCommonFields(record),
        gazette: {
          date: record.gazetteDate
            ? parseIsoDate(record.gazetteDate)
            : undefined,
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
          confirmation_statement: transformProduct183ConfirmationStatement(
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
          date: record.gazetteDate
            ? parseIsoDate(record.gazetteDate)
            : undefined,
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
          date: record.gazetteDate
            ? parseIsoDate(record.gazetteDate)
            : undefined,
        },
        data: {
          registered_office_address: transformProduct183RegisteredOfficeAddress(
            record.address
          ),
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
          date_of_creation: parseIsoDate(record.dateOfIncorporation),
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
          date: parseIsoDate(record.gazetteDate),
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
          date: parseIsoDate(record.gazetteDate),
        },
      };
    case 'Dissolution/Dissolution Final Gazette':
      return {
        type: 'dissolution',
        ...transformCommonFields(record),
        gazette: {
          document_type: record.gazettableDocumentType,
          date: parseIsoDate(record.gazetteDate),
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
          confirmation_statement: transformProduct183ConfirmationStatement(
            record['confirmationStatementDate']
          ),
          last_full_members_list_date: parseIsoDate(
            record.confirmationStatementDate
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
          date: parseIsoDate(record.gazetteDate),
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
          date: parseIsoDate(record.gazetteDate),
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
          confirmation_statement: transformProduct183ConfirmationStatement(
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
  record: Product101Transaction
): Pick<
  CompanyTransaction,
  'transaction_id' | 'received_date' | 'company_number' | 'jurisdiction'
> => ({
  transaction_id: record.transactionId,
  received_date: parseIsoDate(record.receivedDate),
  company_number: record.companyNumber,
  jurisdiction: transformProduct183Jurisdiction(record.jurisdiction),
});
