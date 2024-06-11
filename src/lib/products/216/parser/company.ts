import { Product216CompanyRecord } from './types.js';

export const parseCompanyRecord = (line: string): Product216CompanyRecord => {
  return {
    companyNumber: line.substring(0, 8),
    status: parseCompanyStatus(line.charAt(9)),
    name: line.trim().substring(40, line.trim().length - 1),
    isCorporateBody: true,
  };
};

const parseCompanyStatus = (
  status: string
): Product216CompanyRecord['status'] | '' => {
  const mapping: Record<string, Product216CompanyRecord['status']> = {
    C: 'Converted/closed company',
    D: 'Dissolved company',
    L: 'Company in liquidation',
    R: 'Company in receivership',
    ' ': 'Other',
  };

  return mapping[status] || '';
};
