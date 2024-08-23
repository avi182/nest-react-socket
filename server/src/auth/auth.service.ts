import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from '../users/schema/user.schema';
import { comparePassword, hashPassword } from './utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  readonly PASSWORD_HASH_SALT: string;
  private readonly JWT_SECRET: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {
    this.JWT_SECRET = this.configService.get('JWT_SECRET');
    this.PASSWORD_HASH_SALT = this.configService.get('PASSWORD_HASH_SALT');
    if (!this.PASSWORD_HASH_SALT || !this.JWT_SECRET) {
      throw new Error('PASSWORD_HASH_SALT is not defined');
    }
  }

  async registerUser(
    email: string,
    password: string,
  ): Promise<UserDocument | null> {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    const hashedPassword = await hashPassword(
      password,
      this.PASSWORD_HASH_SALT,
    );
    const user = await this.usersService.create({
      email,
      hashedPassword,
    });
    return user;
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }
    const isPasswordValid = await comparePassword(
      password,
      user.hashedPassword,
    );
    if (!isPasswordValid) {
      return null;
    }
    return user;
  }

  async generateAccessToken(user: UserDocument): Promise<string> {
    const payload = { email: user.email, id: user._id };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '1d',
    });
  }
}
