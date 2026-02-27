import { HttpException, HttpStatus } from '@nestjs/common';

export class RoleNotFoundException extends HttpException {
  constructor(role: string) {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        error: 'Role Not Found',
        message: `The role '${role}' does not exist in the database.`,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
