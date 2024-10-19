import { BadRequestException, Injectable } from '@nestjs/common';
import { db } from '~api/db';
import { LoanDto } from './loan.dto';

@Injectable()
export class LoanService {
  async createLoan(dto: LoanDto) {
    const existedLoan = await db.loan.findFirst({
      where: {
        name: dto.name,
      },
      select: {
        id: true,
      },
    });
    if (existedLoan) throw new BadRequestException('Loan already exists');

    await db.loan.create({
      data: {
        name: dto.name,
        start_at: dto.start_at,
        end_at: dto.end_at,
        mininum_loan_amount: dto.mininum_loan_amount,
        maximum_loan_amount: dto.maximum_loan_amount,
        min_operation_year: dto.min_operation_year,
        valid_company_type: dto.valid_company_type,
        min_annual_sales: dto.min_annual_sales,
        is_malaysia_company: dto.is_malaysia_company,
        instalment_tenure_year: dto.instalment_tenure_year,
        interest_rate: dto.interest_rate,
      },
    });
  }

  async getLoans() {
    return await db.loan.findMany();
  }

  async getLoanApplications() {
    return await db.loanApplication.findMany();
  }

  async updateLoan(dto: LoanDto) {
    const loan = await db.loan.findFirst({
      where: {
        id: dto.id,
      },
      select: {
        id: true,
      },
    });
    if (!loan) throw new BadRequestException('Loan not found');

    await db.loan.update({
      where: {
        id: dto.id,
      },
      data: {
        name: dto.name,
        start_at: dto.start_at,
        end_at: dto.end_at,
        mininum_loan_amount: dto.mininum_loan_amount,
        maximum_loan_amount: dto.maximum_loan_amount,
        min_operation_year: dto.min_operation_year,
        valid_company_type: dto.valid_company_type,
        min_annual_sales: dto.min_annual_sales,
        is_malaysia_company: dto.is_malaysia_company,
        instalment_tenure_year: dto.instalment_tenure_year,
        interest_rate: dto.interest_rate,
      },
    });
  }
}
