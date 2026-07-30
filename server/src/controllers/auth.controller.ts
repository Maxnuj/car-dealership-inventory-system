import type { RequestHandler } from 'express';

import type { AuthServicePort } from '../services/auth.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { success } from '../utils/response.js';

export class AuthController {
  public constructor(private readonly authService: AuthServicePort) {}

  public register: RequestHandler = asyncHandler(async (request, response) => {
    const result = await this.authService.register(request.body);
    success(response, result, 201);
  });

  public login: RequestHandler = asyncHandler(async (request, response) => {
    const result = await this.authService.login(request.body);
    success(response, result);
  });
}
