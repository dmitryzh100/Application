import { Injectable } from '@nestjs/common';

import { UserRepository, type User } from '@event-management/database';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async create(data: { email: string; password: string; name?: string }): Promise<User> {
    return await this.userRepository.createUser(data);
  }
}
