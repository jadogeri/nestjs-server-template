import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiBody } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";
import { User } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";

/** Create User */
export function ApiPostUser() {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    ApiOperation({ summary: 'Create new user', description: 'Registers a new user in the system.' }),
    ApiBody({ 
      type: CreateUserDto,
      examples: {
        example1: {
          summary: 'New User Registration',
          value: { username: 'johndoe', password: 'Password123!', firstName: 'John', lastName: 'Doe', dateOfBirth: '1990-01-01', roles: [{ id: 1, name: 'admin' }] }
        }
      }
    }),
    ApiResponse({ 
      status: HttpStatus.CREATED, 
      description: 'User created successfully.', 
      type: User,
      examples: {
        example1: {
          summary: 'Created User Example',
          value: { id: 1, username: 'johndoe', firstName: 'John', lastName: 'Doe', dateOfBirth: '1990-01-01', roles: [{ id: 1, name: 'admin' }] }
        }
      }
    }),
    ...BearerAuthResponses
  );
}
