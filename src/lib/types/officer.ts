import { Address } from './shared.js';

export type Officer = {
  address?: Address;
  appointed_before?: string;
  appointed_on?: string;
  appointed_to: {
    company_name?: string;
    company_number: string;
    company_status?: string;
  };
  contact_details?: {
    contact_name?: string;
  };
  country_of_residence?: string;
  date_of_birth?: {
    day?: number;
    month: number;
    year: number;
  };
  etag?: string;
  former_names?: [
    {
      forenames?: string;
      surname?: string;
    },
  ];
  identification?: {
    identification_type?: IdentificationType;
    legal_authority?: string;
    legal_form?: string;
    place_registered?: string;
    registration_number?: string;
  };
  is_corporate_body: boolean;
  is_pre_1992_appointment?: boolean;
  links?: {
    officer: {
      appointments: string;
    };
    self: string;
  };
  name: string;
  name_elements?: {
    forename?: string;
    honours?: string;
    other_forenames?: string;
    surname: string;
    title?: string;
  };
  nationality?: string;
  occupation?: string;
  officer_role?: OfficerRole;
  person_number?: string;
  principal_office_address?: Address;
  resigned_on?: string;
  responsibilities?: string;
};

type IdentificationType =
  | 'eea'
  | 'non-eea'
  | 'uk-limited-company'
  | 'other-corporate-body-or-firm'
  | 'registered-overseas-entity-corporate-managing-officer';

type OfficerRole =
  | 'cic-manager'
  | 'corporate-director'
  | 'corporate-llp-designated-member'
  | 'corporate-llp-member'
  | 'corporate-manager-of-an-eeig'
  | 'corporate-managing-officer'
  | 'corporate-member-of-a-management-organ'
  | 'corporate-member-of-a-supervisory-organ'
  | 'corporate-member-of-an-administrative-organ'
  | 'corporate-nominee-director'
  | 'corporate-nominee-secretary'
  | 'corporate-secretary'
  | 'director'
  | 'general-partner-in-a-limited-partnership'
  | 'judicial-factor'
  | 'limited-partner-in-a-limited-partnership'
  | 'llp-designated-member'
  | 'llp-member'
  | 'manager-of-an-eeig'
  | 'managing-officer'
  | 'member-of-a-management-organ'
  | 'member-of-a-supervisory-organ'
  | 'member-of-an-administrative-organ'
  | 'nominee-director'
  | 'nominee-secretary'
  | 'person-authorised-to-accept'
  | 'person-authorised-to-represent'
  | 'person-authorised-to-represent-and-accept'
  | 'receiver-and-manager'
  | 'secretary';
