import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiResponse } from '~api/@typings/request/response';
import { PublicRoute } from '~api/guards/jwt.guard';
import { UserService } from '~api/user/user.service';
import { LoginUserDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Get('profile')
  async getProfile(@Req() req: Request) {
    return req.user;
  }

  @Post('login')
  @PublicRoute()
  async login(
    @Body() dto: LoginUserDto,
  ): Promise<ApiResponse<{ token: string }>> {
    const token = await this.userService.login(dto);
    return { success: true, data: { token } };
  }

  @Post('logout')
  async logout(@Req() req: Request) {
    await this.userService.logout(req.token);
  }
}
