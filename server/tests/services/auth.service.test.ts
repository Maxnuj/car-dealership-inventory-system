import { Role } from '@prisma/client';

import { ConflictError, UnauthorizedError } from '../../src/utils/app-error.js';
import { AuthService } from '../../src/services/auth.service.js';
import type { UserRepositoryPort } from '../../src/repositories/user.repository.js';

const password = 'SecurePassword123!';

describe('AuthService', () => {
  const repository: jest.Mocked<UserRepositoryPort> = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  const service = new AuthService(repository);

  beforeEach(() => jest.clearAllMocks());

  it('registers a normalized user with a bcrypt hash and default USER role', async () => {
    repository.findByEmail.mockResolvedValue(null);
    repository.create.mockImplementation(async (input) => ({
      id: '2ac5c5e4-2ce3-456c-9188-2369b7cb2c72',
      ...input,
      role: Role.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await service.register({
      username: '  Ada  ',
      email: ' ADA@EXAMPLE.COM ',
      password,
    });

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ username: 'ada', email: 'ada@example.com', role: Role.USER }),
    );
    expect(repository.create.mock.calls[0][0].passwordHash).not.toBe(password);
    expect(result.user).toMatchObject({ username: 'ada', email: 'ada@example.com', role: Role.USER });
    expect(result.token).toEqual(expect.any(String));
  });

  it('rejects registration when the normalized email already exists', async () => {
    repository.findByEmail.mockResolvedValue({ id: 'existing-user' } as never);

    await expect(
      service.register({ username: 'Ada', email: 'ada@example.com', password }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it('returns a generic unauthorized error when login credentials are invalid', async () => {
    repository.findByEmail.mockResolvedValue(null);

    await expect(service.login({ email: 'ada@example.com', password })).rejects.toBeInstanceOf(
      UnauthorizedError,
    );
  });
});
