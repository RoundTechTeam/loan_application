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

export type IUser = Omit<
  User,
  'password' | 'token' | 'created_at' | 'updated_at'
>;
export type UserWithoutPassword = Omit<
  User,
  'password' | 'created_at' | 'updated_at'
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
