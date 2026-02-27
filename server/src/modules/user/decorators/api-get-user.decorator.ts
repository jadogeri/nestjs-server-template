import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiBody } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";
import { User } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";

/** Get Single User */
export function ApiGetUser() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Get user by ID', description: 'Fetch a specific user and their relations using their unique ID.' }),
    ApiParam({ name: 'id', description: 'The unique identifier of the user', type: Number, example: 1 }),
    ApiResponse({ 
      status: HttpStatus.OK, 
      description: 'User found.', 
      type: User,
      examples: {
        example1: {
          summary: 'Detailed User View',
          value: { id: 1, firstName: 'John', lastName: 'Doe', dateOfBirth: '1990-01-01', roles: [{ id: 1, name: 'admin' }] }
        }
      }
    }),
    ...BearerAuthResponses
  );
}

