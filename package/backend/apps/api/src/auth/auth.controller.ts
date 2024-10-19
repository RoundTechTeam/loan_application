import { Body, Controller, Get, Post, Put, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiResponse } from '~api/@typings/request/response';
import { PublicRoute } from '~api/guards/jwt.guard';
import { UserService } from '~api/user/user.service';
import { GetUser } from '~api/utils/decorators';
import { UserWithoutPassword } from '~libs/entities';
import { LoginUserDto, RegisterUserDto } from './auth.dto';

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

  @Post('verify-user-account')
  async verifyUserAccount(
    @Body() dto: { verificationCode: number },
    @GetUser() user: UserWithoutPassword,
  ): Promise<boolean> {
    return await this.userService.verifyUserAccount(user, dto.verificationCode);
  }

  @Put('resend-code')
  async resendCode(@GetUser() user: UserWithoutPassword) {
    console.log('user', user);

    await this.userService.resendVerificationCode(user);
  }

  @Post('register')
  @PublicRoute()
  async register(@Body() dto: RegisterUserDto) {
    await this.userService.register(dto);
  }

  @Post('logout')
  async logout(@Req() req: Request) {
    await this.userService.logout(req.token);
  }
}
