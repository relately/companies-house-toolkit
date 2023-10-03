export type Product217Record = {
  CompanyName: string;
  CompanyNumber: string;
  'RegAddress.CareOf': string;
  'RegAddress.POBox': string;
  'RegAddress.AddressLine1': string;
  'RegAddress.AddressLine2': string;
  'RegAddress.PostTown': string;
  'RegAddress.County': string;
  'RegAddress.Country': string;
  'RegAddress.PostCode': string;
  CompanyCategory: Product217CompanyCategory;
  CompanyStatus: Product217CompanyStatus;
  CountryOfOrigin: string;
  DissolutionDate: string;
  IncorporationDate: string;
  'Accounts.AccountRefDay': string;
  'Accounts.AccountRefMonth': string;
  'Accounts.NextDueDate': string;
  'Accounts.LastMadeUpDate': string;
  'Accounts.AccountCategory': Product217AccountsCategory;
  'Returns.NextDueDate': string;
  'Returns.LastMadeUpDate': string;
  'Mortgages.NumMortCharges': string;
  'Mortgages.NumMortOutstanding': string;
  'Mortgages.NumMortPartSatisfied': string;
  'Mortgages.NumMortSatisfied': string;
  'SICCode.SicText_1': string;
  'SICCode.SicText_2': string;
  'SICCode.SicText_3': string;
  'SICCode.SicText_4': string;
  'LimitedPartnerships.NumGenPartners': string;
  'LimitedPartnerships.NumLimPartners': string;
  URI: string;
  'PreviousName_1.CONDATE': string;
  'PreviousName_1.CompanyName': string;
  'PreviousName_2.CONDATE': string;
  'PreviousName_2.CompanyName': string;
  'PreviousName_3.CONDATE': string;
  'PreviousName_3.CompanyName': string;
  'PreviousName_4.CONDATE': string;
  'PreviousName_4.CompanyName': string;
  'PreviousName_5.CONDATE': string;
  'PreviousName_5.CompanyName': string;
  'PreviousName_6.CONDATE': string;
  'PreviousName_6.CompanyName': string;
  'PreviousName_7.CONDATE': string;
  'PreviousName_7.CompanyName': string;
  'PreviousName_8.CONDATE': string;
  'PreviousName_8.CompanyName': string;
  'PreviousName_9.CONDATE': string;
  'PreviousName_9.CompanyName': string;
  'PreviousName_10.CONDATE': string;
  'PreviousName_10.CompanyName': string;
  ConfStmtNextDueDate: string;
  ConfStmtLastMadeUpDate: string;
};

type Product217CompanyStatus =
  | 'In Administration/Administrative Receiver'
  | 'In Administration'
  | 'RECEIVERSHIP'
  | 'ADMINISTRATIVE RECEIVER'
  | 'RECEIVER MANAGER / ADMINISTRATIVE RECEIVER'
  | 'Liquidation'
  | 'Voluntary Arrangement'
  | 'ADMINISTRATION ORDER'
  | 'Active'
  | 'VOLUNTARY ARRANGEMENT / ADMINISTRATIVE RECEIVER'
  | 'In Administration/Receiver Manager'
  | 'Active - Proposal to Strike off'
  | 'Live but Receiver Manager on at least one charge';

type Product217CompanyCategory =
  | 'Charitable Incorporated Organisation'
  | 'Community Interest Company'
  | 'Converted/Closed'
  | 'Further Education and Sixth Form College Corps'
  | 'Industrial and Provident Society'
  | 'Investment Company with Variable Capital'
  | 'Investment Company with Variable Capital (Securities)'
  | 'Investment Company with Variable Capital(Umbrella)'
  | 'Limited Liability Partnership'
  | 'Limited Partnership'
  | 'Old Public Company'
  | 'Other Company Type'
  | 'Overseas Entity'
  | 'PRI/LTD BY GUAR/NSC (Private, limited by guarantee, no share capital)'
  | 'Private Limited Company'
  | "PRI/LBG/NSC (Private, Limited by guarantee, no share capital, use of 'Limited' exemption)"
  | 'PRIV LTD SECT. 30 (Private limited company, section 30 of the Companies Act)'
  | 'Private Unlimited'
  | 'Private Unlimited Company'
  | 'Protected Cell Company'
  | 'Public Limited Company'
  | 'Registered Society'
  | 'Royal Charter Company'
  | 'Scottish Charitable Incorporated Organisation'
  | 'Scottish Partnership'
  | 'United Kingdom Economic Interest Grouping'
  | 'United Kingdom Societas';

type Product217AccountsCategory =
  | 'DORMANT'
  | 'INITIAL'
  | 'NO ACCOUNTS FILED'
  | 'MEDIUM'
  | 'AUDIT EXEMPTION SUBSIDIARY'
  | 'AUDITED ABRIDGED'
  | 'TOTAL EXEMPTION SMALL'
  | 'TOTAL EXEMPTION FULL'
  | 'GROUP'
  | 'FILING EXEMPTION SUBSIDIARY'
  | 'SMALL'
  | 'ACCOUNTS TYPE NOT AVAILABLE'
  | 'UNAUDITED ABRIDGED'
  | 'MICRO ENTITY'
  | 'PARTIAL EXEMPTION'
  | 'FULL';
