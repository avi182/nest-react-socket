import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TokenGuardService } from './token.guard.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [JwtModule],
  providers: [
    ConfigService,
    {
      provide: APP_GUARD,
      useClass: TokenGuardService,
    },
  ],
})
export class TokenGuardModule {}
