import { Controller, Get } from '@nestjs/common';
import { User } from '@prisma/client';
import { AppService } from './app.service';
import { PublicRoute } from './guards/jwt.guard';
import { db } from './db';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @PublicRoute()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('user')
  getUser(): Promise<User> {
    return db.user.findFirst();
  }
}
