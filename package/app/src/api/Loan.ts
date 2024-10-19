import { LoanDto } from '~api/loan/loan.dto';
import { Loan, LoanApplication } from '~libs/entities';
import { Api, getData } from '.';

export default {
  async createLoan(dto: LoanDto) {
    await Api.client('/loan').post('', dto);
  },
  async getLoans() {
    return getData<Loan[]>(await Api.client('/loan').get(''));
  },
  async getLoanApplications() {
    return getData<LoanApplication[]>(
      await Api.client('/loan').get('/applications')
    );
  },
  async updateLoan(dto: LoanDto) {
    await Api.client('/loan').patch('', dto);
  },
};
