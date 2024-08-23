import {
  CanActivate,
  CustomDecorator,
  ExecutionContext,
  Inject,
  SetMetadata,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/schema/user.schema';

export class TokenGuardService implements CanActivate {
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = isPublicResource(this.reflector, context);
    if (isPublic) return true;
    try {
      const req = context?.switchToHttp()?.getRequest();
      const authorization = req?.headers?.authorization;
      if (!authorization) {
        console.warn(`TokenGuard - blocked: No Token`);
        return false;
      }
      const [, token] = authorization.split('Bearer ');
      const user = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      let id = user?.id;
      if (!user || !id) {
        console.warn(`TokenGuard - blocked: No user context, id: ${id}`);
        return false;
      }
      const userContext: UserContext = user;
      req.user = userContext;
      return true;
    } catch (error) {
      console.error('TokenGuard - failed', { error });
      return false;
    }
  }
}

export interface UserContext extends Omit<User, 'hashedPassword'> {}

export const PUBLIC_RESOURCE_DECORATOR = 'publicResourceDecorator';
export const PUBLIC_DECORATOR_FLAG = 'public';

export const PublicResource = (): CustomDecorator<string> =>
  SetMetadata(PUBLIC_RESOURCE_DECORATOR, PUBLIC_DECORATOR_FLAG);

export const isPublicResource = (
  reflector: Reflector,
  context: ExecutionContext,
): boolean => {
  const classValue = reflector?.get(
    PUBLIC_RESOURCE_DECORATOR,
    context?.getClass(),
  );
  const handlerValue = reflector?.get(
    PUBLIC_RESOURCE_DECORATOR,
    context?.getHandler(),
  );
  const value = classValue || handlerValue;
  return value && value === PUBLIC_DECORATOR_FLAG;
};
