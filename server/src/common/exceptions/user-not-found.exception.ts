import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor(message?: string) {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        error: 'User Not Found',
        message: message || 'The user does not exist in the database.',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
