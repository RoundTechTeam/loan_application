import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { db } from '~api/db';
import { IUser } from '~libs/entities';

@Injectable()
export class AuthService {
  async validate(accessToken: string): Promise<IUser> {
    const userSession = await db.userSession.findFirst({
      where: { token: accessToken },
      select: {
        User: true,
      },
    });
    if (!userSession) throw new NotFoundException();
    if (!userSession?.User) throw new UnauthorizedException();
    return {
      id: userSession.User.id,
      full_name: userSession.User.full_name,
      is_admin: userSession.User.is_admin,
      is_delete: userSession.User.is_delete,
      contact_no: userSession.User.contact_no,
      country_code: userSession.User.country_code,
      is_verified: userSession.User.is_verified,
      verification_code: userSession.User.verification_code,
    };
  }
}
