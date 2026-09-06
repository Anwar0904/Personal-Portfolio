import { ApiError } from './ApiError';

export class NotFoundError extends ApiError {
  constructor(message: string = 'Not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}
