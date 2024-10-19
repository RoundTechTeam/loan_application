import { BadRequestException, Injectable } from '@nestjs/common';
import { db } from '~api/db';
import { IUser, LoanApplicationDetail } from '~libs/entities';
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

    console.log('dto', dto.start_at);
    console.log('dto', dto.end_at);

    console.log('dto', new Date(dto.start_at));
    console.log('dto', new Date(dto.end_at));

    await db.loan.create({
      data: {
        name: dto.name,
        start_at: new Date(dto.start_at),
        end_at: new Date(dto.end_at),
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

  async getLoanApplications(user: IUser): Promise<LoanApplicationDetail[]> {
    return await db.loanApplication.findMany({
      where: {
        user_id: user.is_admin ? undefined : user.id,
      },
      include: {
        applied_by: {
          select: {
            full_name: true,
            country_code: true,
            contact_no: true,
          },
        },
        Loan: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
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

  async deleteLoan(loan_id: number) {
    const loan = await db.loan.findFirst({
      where: {
        id: loan_id,
      },
      select: {
        id: true,
      },
    });
    if (!loan) throw new BadRequestException('Loan not found');

    await db.loan.delete({
      where: {
        id: loan_id,
      },
    });
  }
}
