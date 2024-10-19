import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '365d',
      },
    }),
    AuthModule,
  ],
  exports: [JwtModule, AuthModule],
})
export class GlobalModule {}
