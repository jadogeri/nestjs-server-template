import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiBody } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";
import { User } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";

/** Get All Users */
export function ApiGetUsers() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOperation({ 
      summary: 'Get all users', 
      description: 'Retrieves a list of all users with their associated roles and profile information.' 
    }),
    ApiResponse({ 
      status: HttpStatus.OK, 
      description: 'Users retrieved successfully.', 
      type: [User],
      examples: {
        example1: {
          summary: 'User List Example',
          value: [
            { id: 1, firstName: 'John', lastName: 'Doe', fullName: 'John Doe', email: 'john@example.com', roles: [{ id: 1, name: 'admin' }] },
            { id: 2, firstName: 'Jane', lastName: 'Smith', fullName: 'Jane Smith', email: 'jane@example.com', roles: [{ id: 2, name: 'user' }] }
          ]
        }
      }
    }),
    ...BearerAuthResponses
  );
}
