import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { GetUser } from '~api/decorators';
import { IUser } from '~libs/entities';
import {
  LoanApplicationDto,
  LoanDto,
  UpdateLoanApplicationDto,
} from './loan.dto';
import { LoanService } from './loan.service';

@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post()
  async createLoan(@Body() dto: LoanDto) {
    await this.loanService.createLoan(dto);
  }

  @Post('application')
  async applyLoan(@Body() dto: LoanApplicationDto, @GetUser() user: IUser) {
    await this.loanService.applyLoan(user.id, dto);
  }

  @Post('aiScan')
  async aiScan(@Body() dto: string, @GetUser() user: IUser) {
    return await this.loanService.aiScan(dto, user.id);
  }

  @Get()
  async getLoans() {
    return await this.loanService.getLoans();
  }

  @Get('applications')
  async getLoanApplications(@GetUser() user: IUser) {
    return await this.loanService.getLoanApplications(user);
  }

  @Patch()
  async updateLoan(@Body() dto: LoanDto) {
    await this.loanService.updateLoan(dto);
  }

  @Patch('application')
  async updateLoanApplication(
    @Body() dto: UpdateLoanApplicationDto,
    @GetUser() user: IUser,
  ) {
    await this.loanService.updateLoanApplication(user, dto);
  }

  @Delete(':id')
  async deleteLoan(@Param('id') loan_id: number) {
    await this.loanService.deleteLoan(loan_id);
  }
}
