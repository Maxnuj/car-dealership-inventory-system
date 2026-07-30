import bcrypt from 'bcrypt';
import { Role, type User } from '@prisma/client';
import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import type { UserRepositoryPort } from '../repositories/user.repository.js';
import type { LoginInput, RegisterInput } from '../validators/auth.validator.js';
import { ConflictError, UnauthorizedError } from '../utils/app-error.js';

export type AuthenticatedUser = Pick<User, 'id' | 'username' | 'email' | 'role'>;
export type AuthResult = { token: string; user: AuthenticatedUser };
export interface AuthServicePort {
  register(input: RegisterInput): Promise<AuthResult>;
  login(input: LoginInput): Promise<AuthResult>;
}

const normalize = (value: string): string => value.trim().toLowerCase();

export class AuthService implements AuthServicePort {
  public constructor(private readonly users: UserRepositoryPort) {}

  public async register(input: RegisterInput): Promise<AuthResult> {
    const email = normalize(input.email);
    const username = normalize(input.username);
    if (await this.users.findByEmail(email)) throw new ConflictError('An account with this email already exists');

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await this.users.create({ email, username, passwordHash, role: Role.USER });
    return this.createResult(user);
  }

  public async login(input: LoginInput): Promise<AuthResult> {
    const user = await this.users.findByEmail(normalize(input.email));
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) throw new UnauthorizedError();
    return this.createResult(user);
  }

  private createResult(user: User): AuthResult {
    const safeUser: AuthenticatedUser = { id: user.id, username: user.username, email: user.email, role: user.role };
    const token = jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
    return { token, user: safeUser };
  }
}
