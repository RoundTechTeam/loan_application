import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import fs from 'fs/promises';
import Groq from 'groq-sdk';
import OpenAI from 'openai';
import path from 'path';
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
        file_path: dto.file_path,
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

  async sendTogGroq(text: string) {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const importantInfo = [
      'Company Name',
      'Company Incorporation Date',
      'Company Type',
      'Retain Earning',
      'Revenue',
    ];

    let completion;
    const aiModels = ['gemma2-9b-it', 'llama3-8b-8192'];
    let count = 0;
    const maxTries = 2;
    while (count < 2) {
      try {
        completion = await groq.chat.completions.create({
          temperature: 0.5,
          response_format: {
            type: 'json_object',
          },
          messages: [
            {
              role: 'system',
              content: `
                  You are an AI assistant that help to find the important information from the ${text}.

                  ##Important
                  I have few important information that I need to get from the ${text}.
                  ${importantInfo.map((info) => `1. ${info}`).join('\n')}

                  ##Response
                  Please provide me the important information from the ${text}.

                  ##Extra Part
                  when assign Type please choose from the following list:
                 1."PRIVATE_LIMITED",
                 2."SOLE_PROPRIETORSHIP",
                 3"PARTNERSHIP",

                  ##Result
                  Object Key must follow ${importantInfo.join(',')}
                  Must be return the result JSON format. Dont return any other text.
                  Just return the result Json no need add title or anything else.
                  
              
                  `,
            },
          ],
          model: aiModels[count],
        });

        console.log(completion.choices[0].message.content);

        if (completion) return completion.choices[0].message.content as string;
      } catch (e) {
        count = count + 1;
        if (count === maxTries) throw e;
      }
    }
    if (!completion) return;
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
                      Must be return the result JSON format.
                     
                      ##Example
                      {
                      'Company Name': '',
                      'Company Incorporation Date': '',
                      'Company Type': '',
                      'Retain Earning': '',
                      'Revenue': '',
                      }

                    `;

    const responese = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: content }],
    });

    console.log(responese.choices[0].message.content);

    return responese.choices[0].message.content;

    // for await (const chunk of stream) {
    //   console.log(chunk);
    //   process.stdout.write(chunk.choices[0]?.delta?.content || '');
    // }

    // return stream;
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

    const fileLocation = Object.keys(filePath)[0];

    if (fileLocation.endsWith('.pdf')) {
      const response = await axios.get(fileLocation, {
        responseType: 'arraybuffer',
      });

      const saveFolder = path.resolve(
        __dirname,
        `../../../../backend/apps/api/src/ai-generator/image`,
      );

      const filePath = path.join(saveFolder, 'test.pdf');

      await fs.writeFile(filePath, response.data);

      const filePathLocation = path.resolve(
        __dirname,
        `../../../../backend/apps/api/src/ai-generator/image/test.pdf`,
      );

      const newFileName = path.basename(
        filePathLocation,
        path.extname(filePathLocation),
      );

      const opts = {
        format: 'png',
        out_dir: outDirectory,
        out_prefix: newFileName,
        page: null,
      };

      await pdfPoppler.convert(filePathLocation, opts).then(async () => {
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
      images.push(fileLocation);
    }

    const textToSubmit = [];

    for (const image of images) {
      await Tesseract.recognize(
        image,
        'eng', // Use English language
      ).then(async (result: RecognizeResult) => {
        textToSubmit.push(result.data.text);
      });
    }

    const resp = await this.sendTogGroq(textToSubmit.join(','));

    return resp;
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
