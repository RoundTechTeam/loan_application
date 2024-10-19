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
  implements Pick<LoanApplication, 'id' | 'user_id' | 'loan_id'>
{
  @IsNumber()
  @IsOptional()
  id: number | null;

  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsNumber()
  @IsNotEmpty()
  loan_id: number;
}
