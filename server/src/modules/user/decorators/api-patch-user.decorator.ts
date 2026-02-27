import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiBody } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";
import { User } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";


/** Update User */
export function ApiPatchUser() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Update user', description: 'Updates existing user details. Only provided fields will be modified.' }),
    ApiParam({ name: 'id', description: 'ID of the user to update', type: Number }),
    ApiBody({ 
      type: UpdateUserDto,
      examples: {
        example1: {
          summary: 'Partial Update (Email only)',
          value: { email: 'new.email@example.com' }
        },
        example2: {
          summary: 'Name Update',
          value: { firstName: 'Johnny', lastName: 'Deep' }
        }
      }
    }),
    ApiResponse({ status: HttpStatus.OK, description: 'User updated successfully.', type: User }),
    ...BearerAuthResponses
  );
}
