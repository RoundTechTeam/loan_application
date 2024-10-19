import { ApiResponse } from '~api/@typings/request/response';
import { LoginUserDto, RegisterUserDto } from '~api/auth/auth.dto';
import { UserWithoutPassword } from '~libs/entities';
import { getData } from '~libs/helpers';
import { Api } from '.';

export default {
  async register(dto: RegisterUserDto): Promise<number> {
    return (await Api.client('/auth', false).post('/register', dto)).status;
  },
  async fetchUser() {
    return getData<UserWithoutPassword>(
      await Api.client('/auth').get('/profile')
    );
  },
  async login(dto: LoginUserDto) {
    return getData<ApiResponse<{ token: string }>>(
      await Api.client('/auth', false).post('/login', dto)
    );
  },
  async logout() {
    await Api.client('/auth').post('/logout');
  },
};
