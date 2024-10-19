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
  async getLoanApplications(@GetUser() user: IUser) {
    return await this.loanService.getLoanApplications(user);
  }

  @Patch()
  async updateLoan(@Body() dto: LoanDto) {
    await this.loanService.updateLoan(dto);
  }

  @Delete(':id')
  async deleteLoan(@Param('id') loan_id: number) {
    await this.loanService.deleteLoan(loan_id);
  }
}
