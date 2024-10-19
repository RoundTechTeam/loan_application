import { BadRequestException, Injectable } from '@nestjs/common';
import { db } from '~api/db';
import { IUser, LoanApplicationDetail } from '~libs/entities';
import {
  LoanApplicationDto,
  LoanDto,
  UpdateLoanApplicationDto,
} from './loan.dto';
import { ApplicationStatus } from '~libs/entities/enums';

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

  async applyLoan(userId: number, dto: LoanApplicationDto) {
    await db.loanApplication.create({
      data: {
        business_name: dto.business_name,
        company_type: dto.company_type,
        is_malaysia_company: dto.is_malaysia_company,
        annual_sales: dto.annual_sales,
        operation_year: dto.operation_year,
        loan_applied_at: new Date(),
        applied_by: {
          connect: {
            id: userId,
          },
        },
        Loan: {
          connect: {
            id: dto.loan_id,
          },
        },
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
            maximum_loan_amount: true,
            mininum_loan_amount: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
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

  async updateLoanApplication(user: IUser, dto: UpdateLoanApplicationDto) {
    const fundManager = await db.fundManager.findFirst({
      where: {
        user_id: user.id,
      },
      select: {
        id: true,
      },
    });
    if (!fundManager)
      throw new BadRequestException(
        'You have no permission to approve/reject loan application',
      );

    const application = await db.loanApplication.findFirst({
      where: {
        id: dto.id,
      },
      select: {
        id: true,
        status: true,
      },
    });
    if (!application) throw new BadRequestException('Application not found');

    if (application.status !== ApplicationStatus.PENDING)
      throw new BadRequestException('Application is not pending');

    await db.loanApplication.update({
      where: {
        id: dto.id,
      },
      data: {
        approved_loan_amount: dto.approved_loan_amount,
        status: dto.status,
        approved_at:
          dto.status === ApplicationStatus.APPROVED ? new Date() : null,
        rejected_at:
          dto.status === ApplicationStatus.REJECTED ? new Date() : null,
        processed_by: {
          connect: {
            id: fundManager.id,
          },
        },
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
