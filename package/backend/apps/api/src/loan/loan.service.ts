import { BadRequestException, Injectable } from '@nestjs/common';
import fs from 'fs/promises';
import OpenAI from 'openai';
import pdfPoppler from 'pdf-poppler';
import Tesseract, { RecognizeResult } from 'tesseract.js';
import { db } from '~api/db';
import { IUser, LoanApplicationDetail } from '~libs/entities';
import { ApplicationStatus } from '~libs/entities/enums';
import {
  LoanApplicationDto,
  LoanDto,
  UpdateLoanApplicationDto,
} from './loan.dto';

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

  async sendToChatGpt(text: string) {
    const openai = new OpenAI({
      defaultHeaders: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    const importantInfo = [
      'Company Name',
      'Company Incorporation Date',
      'Company Type',
      'Retain Earning',
      'Revenue',
    ];

    const content = `
                     You are an AI assistant that help to find the important information from the ${text}.
  
                     ##Important
                     I have few important information that I need to get from the ${text}.
                     ${importantInfo.map((info) => `1. ${info}`).join('\n')}
  
                     ##Response
                     Please provide me the important information from the ${text}.
  
                     ##Result
                     Here is the result:
                      'Company Name': '',
                      'Company Incorporation Date': '',
                      'Company Type': '',
                      'Retain Earning': '',
                      'Revenue': '',
                    `;

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: content }],
      stream: true,
    });
    for await (const chunk of stream) {
      process.stdout.write(chunk.choices[0]?.delta?.content || '');
    }

    return stream;
  }

  async aiScan(filePath: string, user_id: number) {
    const user = await db.user.findFirst({
      where: {
        id: user_id,
      },
      select: {
        id: true,
      },
    });

    if (!user) throw new BadRequestException('User not found');

    const images = [];

    const outDirectory = path.resolve(
      __dirname,
      `../../../../backend/apps/api/src/ai-generator/image/generator-image`,
    );

    if (filePath.endsWith('.pdf')) {
      const newFileName = path.basename(filePath, path.extname(filePath));

      const opts = {
        format: 'png',
        out_dir: outDirectory,
        out_prefix: newFileName,
        page: null,
      };

      await pdfPoppler.convert(filePath, opts).then(async () => {
        for (let i = 0; i < 15; i++) {
          const fileName = path.resolve(
            __dirname,
            `../../../../backend/apps/api/src/ai-generator/image/generator-image/${newFileName}-${
              i + 1
            }.png`,
          );

          await fs
            .access(fileName, fs.constants.F_OK)
            .then(() => {
              images.push(fileName);
            })
            .catch(() => {
              console.log('file not found');
            });
        }
      });
    } else {
      images.push(filePath);
    }

    const textToSubmit = [];

    for (const image of images) {
      await Tesseract.recognize(
        image,
        'eng', // Use English language
      ).then(async (result: RecognizeResult) => {
        console.log(result.data.text);
        textToSubmit.push(result.data.text);
      });
    }

    await this.sendToChatGpt(textToSubmit.join(','));
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
