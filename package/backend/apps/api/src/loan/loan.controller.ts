import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { LoanDto } from './loan.dto';
import { LoanService } from './loan.service';

@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post()
  async createLoan(@Body() dto: LoanDto) {
    await this.loanService.createLoan(dto);
  }

  @Get()
  async getLoans() {
    return await this.loanService.getLoans();
  }

  @Get('applications')
  async getLoanApplications() {
    return await this.loanService.getLoanApplications();
  }

  @Patch()
  async updateLoan(@Body() dto: LoanDto) {
    await this.loanService.updateLoan(dto);
  }
}
