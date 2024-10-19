import {
  Business,
  Director,
  FinancialRecord,
  FundManager,
  Loan,
  LoanApplication,
  User,
  UserSession,
} from '@prisma/client';
import { CountryCode } from 'libphonenumber-js';
import { ECountryCodeP } from './enums';
export * from './pagination';

export const dateFormat = 'DD/MM/YYYY';
export const dateTimeFormat = `${dateFormat} h:mm A`;

export type IUser = Omit<
  User,
  'password' | 'token' | 'created_at' | 'updated_at' | 'verification_code'
>;
export type UserWithoutPassword = Omit<
  User,
  'password' | 'created_at' | 'updated_at' | 'verification_code'
>;

export interface Country {
  name?: string;
  code: CountryCode;
  extension: string;
}

export interface PhoneDetails {
  contact_no: string;
  country_code: ECountryCodeP;
}

export type LoanApplicationDetail = LoanApplication & {
  applied_by: Pick<User, 'full_name' | 'country_code' | 'contact_no'>;
  Loan: Pick<
    Loan,
    'id' | 'name' | 'maximum_loan_amount' | 'mininum_loan_amount'
  >;
};

export {
  Business,
  Director,
  FinancialRecord,
  FundManager,
  Loan,
  LoanApplication,
  User,
  UserSession,
};
