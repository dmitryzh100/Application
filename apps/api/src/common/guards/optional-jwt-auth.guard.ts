import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): ReturnType<typeof AuthGuard.prototype.canActivate> {
    return super.canActivate(context);
  }

  handleRequest<T>(err: Error | null, user: T): T | null {
    if (err || !user) {
      return null as T;
    }

    return user;
  }
}
