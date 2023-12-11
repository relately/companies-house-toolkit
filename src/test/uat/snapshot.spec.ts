import axios, { AxiosError } from 'axios';
import 'dotenv/config';
import { describe, expect, it } from 'vitest';
import { Company } from '../../lib/types/company.js';
import runCli from '../e2e/run-cli.js';
import { syncProducts } from './sync.js';

const companyNumbers: string[] = [
  'OC387951',
  '09683623',
  'OC427061',
  '06288462',
  '07644785',
  '12002104',
  '01286713',
  '08745035',
  '12098813',
  '09244324',
  '09572930',
  '10991077',
  '12884079',
  '06502993',
  '09962930',
  '10700557',
  '11711600',
  '09910024',
  '01265421',
  '10134865',
  '10801248',
  '05478444',
  '08117980',
  '11479301',
  '01136605',
  '03515983',
  '07244951',
  '10134846',
  '11920644',
  'FC028932',
  '11781145',
  '06825145',
  '12783260',
  '12795242',
  '12400976',
  '09004574',
  'SC543956',
  '04206666',
  'FC039326',
  '02634595',
  '05001400',
  '07705260',
  '09214380',
  'NI618997',
  'SC656367',
  '11748109',
  '05180506',
  'FC039328',
  '07201749',
  '12113521',
  '10349937',
  '04566915',
  '09352169',
  '09930724',
  '01182065',
  '12465185',
  '09603185',
  '12188120',
  '12809848',
  '03066238',
  '01247726',
  '10528433',
  '04943587',
  '04784116',
  '12582622',
  '11012522',
  '12785767',
  'OE000245',
  '06396490',
  '09129036',
  '10535653',
  '12273524',
  '12276784',
  'OC429877',
  '08698059',
  'FC039329',
  'OE000518',
  'OE001696',
  'OE000786',
  'OE000806',
  '08096952',
  // 'OE001782',
  // 'OE001654',
  // '10530619',
  // 'OC328905',
  // 'OE001347',
  // 'OE002806',
  // 'SC635423',
  // 'OE001091',
  // 'OE002669',
  // 'OE002575',
  // '10682467',
  // 'OE003892',
  // '03809572',
  // '07805434',
  // '12369587',
  // '12579762',
  // '01372245',
  // '11777555',
  // '12008337',
  // '14513288',
  // '03704349',
  // '07292036',
  // '11286811',
  // '09553692',
  // '08537429',
  // '01131388',
  // '05443709',
  // 'IP031320',
  // '00835034',
  // '07824382',
  // '10364386',
  // '09281952',
  // '06004687',
  // 'OC338183',
  // '05323220',
  // '05609852',
  // '09781534',
  // '03381164',
  // 'SC228928',
  // '05812172',
  // 'FC039335',
  // '12839766',
  // 'IP031047',
  // '12739355',
  // 'SC278441',
  // '04673263',
  // 'OE001206',
  // 'OE002619',
  // 'OE017084',
  // 'OE019958',
  // 'OE008122',
  // 'OE012197',
  // 'OE014500',
  // 'SO303288',
  // 'OE000262',
  // 'OE000430',
  // '10603104',
  // 'OE000300',
  // 'OE000302',
  // 'OE001152',
  // 'OE001260',
  // 'OE001445',
  // 'OE028460',
  // 'OE024075',
  // 'OE011173',
  // 'OE011255',
  // 'OE002093',
  // 'OE004457',
  // 'OE005304',
  // 'OE006485',
  // 'OE007093',
  // 'OE009748',
  // 'OE012605',
  // 'OE014493',
  // 'OE021184',
  // 'OE024379',
  // 'OE017922',
  // 'OE020134',
  // '07730154',
  // 'OE023819',
  // 'OE002473',
  // 'OE004946',
  // 'OE018615',
  // 'IP26473R',
  // '12535842',
  // 'OE029493',
  // 'OE021501',
  // '09290399',
  // '00601861',
  // '05792123',
  // '08450090',
  // '09855219',
  // '09692620',
  // '10668546',
  // '08703102',
  // '00658889',
  // '11871268',
  // '05533782',
  // '09058011',
  // '08614557',
  // '10487421',
  // '12453375',
  // '11711044',
  // '11036642',
  // 'FC039333',
  // 'OE023459',
  // '03800111',
  // 'FC039338',
  // '06665330',
  // '10542519',
  // 'OC427626',
  // '06847627',
  // '03978855',
  // '06891081',
  // '11603867',
  // '06033276',
  // '10540976',
  // '12418020',
  // '10474382',
  // '12237652',
  // 'OE002943',
  // 'OE021316',
  // '08923656',
  // 'SC340463',
  // '08389346',
  // '11704995',
];

describe(
  'company snapshot',
  () => {
    it('should produce output the same as the Companies House API', async () => {
      await syncProducts(['prod100', 'prod101', 'prod183']);

      const { stdout } = await runCli([
        'snapshot',
        `--snapshot-path=${process.cwd()}/src/test/uat/data/prod183`,
        `--updates-path=${process.cwd()}/src/test/uat/data/prod101`,
        `--alternative-updates-path=${process.cwd()}/src/test/uat/data/prod100`,
        `--companies=${companyNumbers.join(',')}`,
        '--product-pair=183,101',
        `--json`,
      ]);

      const results = JSON.parse(stdout) as Company[];

      for (const result of results) {
        const data = await callCompaniesHouseApi(result['company_number']);

        if (data !== null) {
          checkFields(result, data);
        }
      }
    });
  },
  { timeout: 360000000 }
);

async function callCompaniesHouseApi(companyNumber: string) {
  try {
    const { data } = await axios.get<Company>(
      `https://api.company-information.service.gov.uk/company/${companyNumber}`,
      {
        auth: {
          username: process.env.COMPANIES_HOUSE_API_KEY || '',
          password: '',
        },
      }
    );

    return data;
  } catch (error: unknown) {
    console.log(companyNumber, (error as AxiosError)?.response?.status);

    return null;
  }
}

function checkFields(actual: Company, expected: Company, path = '', id = '') {
  for (const key in actual) {
    if (
      Object.prototype.hasOwnProperty.call(actual, key) &&
      Object.prototype.hasOwnProperty.call(expected, key)
    ) {
      const newPath = path ? `${path}.${key}` : key;

      // If we're comparing an address just compare the formatted lines
      // Our fields are often more accurate than the API's in terms of field names
      // What we really care about is if the address is correct as a whole or not
      if (key === 'registered_office_address') {
        const expectedAddress = [
          expected[key]?.['care_of'],
          expected[key]?.['po_box'],
          expected[key]?.['premises'],
          expected[key]?.['address_line_1'],
          expected[key]?.['address_line_2'],
          expected[key]?.['locality'],
          expected[key]?.['region'],
          expected[key]?.['postal_code'],
          expected[key]?.['country'],
        ]
          .filter((line) => !!line)
          .join(' ');
        const actualAddress = [
          actual[key]?.['care_of'],
          actual[key]?.['po_box'],
          actual[key]?.['premises'],
          actual[key]?.['address_line_1'],
          actual[key]?.['address_line_2'],
          actual[key]?.['locality'],
          actual[key]?.['region'],
          actual[key]?.['postal_code'],
          actual[key]?.['country'],
        ]
          .filter((line) => !!line)
          .join(' ');

        expect
          .soft(
            actualAddress,
            `Company ${expected['company_number'] || id} ${newPath}`
          )
          .toEqual(expectedAddress);

        continue;
      }

      if (
        typeof actual[key] === 'object' &&
        actual[key] !== null &&
        typeof expected[key] === 'object' &&
        expected[key] !== null
      ) {
        // If the field is an object, recursively check its fields
        checkFields(
          actual[key] as Company,
          expected[key] as Company,
          newPath,
          expected['company_number'] || id
        );
      } else {
        // If the field is not an object, check that the values are equal
        expect
          .soft(
            typeof actual[key] == 'number'
              ? (actual[key] as number).toString().padStart(2, '0')
              : actual[key],
            `Company ${expected['company_number'] || id} ${newPath}`
          )
          .toEqual(expected[key]);
      }
    }
  }
}
