import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiBody } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";
import { User } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";

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
          value: { username: 'johndoe', password: 'Password123!', email: 'john@doe.com', firstName: 'John', lastName: 'Doe' }
        }
      }
    }),
    ApiResponse({ 
      status: HttpStatus.CREATED, 
      description: 'User created successfully.', 
      type: User 
    }),
    ...BearerAuthResponses
  );
}
