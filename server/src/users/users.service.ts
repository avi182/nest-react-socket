import { Injectable } from '@nestjs/common';
import { UsersDAL } from './users.dal';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersDAL: UsersDAL) {}

  async create(user: User): Promise<UserDocument> {
    return this.usersDAL.create(user);
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.usersDAL.findByEmail(email);
  }
}
