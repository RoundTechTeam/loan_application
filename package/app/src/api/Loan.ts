import { LoanDto } from '~api/loan/loan.dto';
import { Loan, LoanApplicationDetail } from '~libs/entities';
import { Api, getData } from '.';

export default {
  async createLoan(dto: LoanDto) {
    await Api.client('/loan').post('', dto);
  },
  async getLoans() {
    return getData<Loan[]>(await Api.client('/loan').get(''));
  },
  async getLoanApplications() {
    return getData<LoanApplicationDetail[]>(
      await Api.client('/loan').get('/applications')
    );
  },
  async updateLoan(dto: LoanDto) {
    await Api.client('/loan').patch('', dto);
  },
  async deleteLoan(loan_id: number) {
    await Api.client('/loan').delete(`/${loan_id}`);
  },
};
