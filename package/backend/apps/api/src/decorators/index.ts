import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { IUser } from '~libs/entities';

export const GetUser = createParamDecorator(
  (_, ctx: ExecutionContext): IUser => {
    const req = ctx.switchToHttp().getRequest<Request>();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return req.user;
  },
);
