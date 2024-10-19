import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { LoginUserDto, RegisterUserDto } from '~api/auth/auth.dto';
import { db } from '~api/db';
import { TwilioSdk } from '~api/sdk/twilio-sdk/twilio.sdk';
import { User, UserWithoutPassword } from '~libs/entities';
import { buildPhoneNumber } from '~libs/helpers';

export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

@Injectable()
export class UserService {
  constructor(private jwtService: JwtService) {}

  async login(dto: LoginUserDto): Promise<string> {
    const foundUser = await db.user.findFirst({
      where: {
        contact_no: {
          mode: 'insensitive',
          equals: dto.contact_no,
        },
        country_code: {
          equals: dto.country_code,
        },
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (foundUser === null || foundUser === undefined)
      throw new BadRequestException('No user found with this contact number');

    const isMatch = await comparePassword(dto.password, foundUser.password);
    if (!isMatch)
      throw new BadRequestException('Invalid username or password entered');

    return await this.generateToken(foundUser.id);
  }

  async generateToken(id: number): Promise<string> {
    const token = this.jwtService.sign(
      {
        id: id,
      },
      { secret: process.env.JWT_SECRET },
    );
    await db.userSession.create({
      data: {
        token: token,
        user_id: id,
      },
    });
    return token;
  }

  async register(dto: RegisterUserDto): Promise<void> {
    let user: User;

    await db.$transaction(async (db) => {
      const foundUser = await db.user.findFirst({
        where: {
          contact_no: {
            equals: dto.contact_no,
          },
          country_code: {
            equals: dto.country_code,
          },
        },
      });

      if (foundUser?.id)
        throw new BadRequestException('This contact number is taken by other');

      user = await db.user.create({
        data: {
          full_name: dto.full_name,
          contact_no: dto.contact_no,
          country_code: dto.country_code,
          password: await hashPassword(dto.password),
        },
      });
    });
    //Send Verification Code
    await this.resendVerificationCode(user);
  }

  async resendVerificationCode(user: UserWithoutPassword): Promise<void> {
    const twilioSdk = new TwilioSdk();
    await twilioSdk.sendVerificationContentTemplate(
      '',
      '',
      '',
      buildPhoneNumber(user.country_code, user.contact_no),
      {},
    );

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        verification_code: 168888,
      },
    });
  }

  async verifyUserAccount(
    user: UserWithoutPassword,
    verificationCode: number,
  ): Promise<boolean> {
    const foundUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (
      foundUser.verification_code?.toString() === verificationCode?.toString()
    ) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          is_verified: true,
        },
      });

      return true;
    }

    return false;
  }

  async logout(token: string) {
    return db.userSession.delete({ where: { token: token } });
  }
}
