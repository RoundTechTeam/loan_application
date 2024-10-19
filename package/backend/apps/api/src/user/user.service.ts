import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { LoginUserDto } from '~api/auth/auth.dto';
import { db } from '~api/db';

export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
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
}
