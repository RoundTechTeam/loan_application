import { CompanyType, Loan, LoanApplication } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApplicationStatus } from '~libs/entities/enums';

export class LoanDto implements Omit<Loan, 'created_at' | 'updated_at'> {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  id: number | null;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  start_at: Date;

  @IsDateString()
  @IsNotEmpty()
  end_at: Date;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  mininum_loan_amount: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  maximum_loan_amount: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  min_operation_year: number;

  @IsEnum(CompanyType)
  valid_company_type: CompanyType;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  min_annual_sales: number;

  @IsBoolean()
  @IsNotEmpty()
  is_malaysia_company: boolean;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  instalment_tenure_year: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  interest_rate: number;
}

export class LoanApplicationDto
  implements
    Pick<
      LoanApplication,
      | 'loan_id'
      | 'operation_year'
      | 'annual_sales'
      | 'business_name'
      | 'company_type'
      | 'is_malaysia_company'
      | 'file_image_path'
    >
{
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  loan_id: number;

  @IsString()
  @IsNotEmpty()
  business_name: string;

  @IsString()
  @IsNotEmpty()
  file_image_path: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  operation_year: number;

  @IsEnum(CompanyType)
  company_type: CompanyType;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  annual_sales: number;

  @IsBoolean()
  @IsNotEmpty()
  is_malaysia_company: boolean;
}

export class UpdateLoanApplicationDto
  implements Pick<LoanApplication, 'id' | 'approved_loan_amount' | 'status'>
{
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  approved_loan_amount: number;

  @IsEnum(ApplicationStatus)
  @IsNotEmpty()
  status: ApplicationStatus;
}
