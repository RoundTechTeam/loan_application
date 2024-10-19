import { ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

export const PUBLIC_ROUTE = 'PUBLIC_ROUTE';
export const PublicRoute = () => SetMetadata(PUBLIC_ROUTE, true);
export const IsPublic = (reflector: Reflector, context: ExecutionContext) =>
  reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE, [
    context.getHandler(),
    context.getClass(),
  ]);

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  canActivate(context: ExecutionContext) {
    const isPublic = IsPublic(this.reflector, context);
    if (isPublic) return true;
    return super.canActivate(context);
  }
}
