import { UserWithoutPassword } from '~libs/entities';

declare module 'express' {
  export interface Request {
    token: string;
    tokenCreatedAt: Date;

    User: UserWithoutPassword;
  }
}
