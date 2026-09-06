import { ApiError } from './ApiError';

export class AuthorizationError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}
