import { PrismaClient, Role, type User } from '@prisma/client';

export type CreateUserData = { username: string; email: string; passwordHash: string; role: Role };

export interface UserRepositoryPort {
  create(data: CreateUserData): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}

export class UserRepository implements UserRepositoryPort {
  public constructor(private readonly client: PrismaClient) {}

  public create(data: CreateUserData): Promise<User> {
    return this.client.user.create({ data });
  }

  public findByEmail(email: string): Promise<User | null> {
    return this.client.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });
  }
}
