import { Module } from '@nestjs/common';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';

@Module({
  providers: [LoanService],
  controllers: [LoanController],
})
export class LoanModule {}
