import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiBody } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";
import { User } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { first } from "rxjs";
import { da } from "@faker-js/faker";


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
          value: { 
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '1990-01-01',
            roles: [{ id: 1, name: 'admin' }]
          }
        },
        example2: {
          summary: 'Name Update',
          value: { firstName: 'Johnny', lastName: 'Deep' }
        }
      }
    }),
    ApiResponse({ 
      status: HttpStatus.OK, 
      description: 'User updated successfully.', 
      type: User,
      examples: {
        example1: {
          summary: 'Updated User Example',
          value: { id: 1, firstName: 'Johnny', lastName: 'Deep', dateOfBirth: '1990-01-01', roles: [{ id: 1, name: 'admin' }] }
        }
      }
    }),
    ...BearerAuthResponses
  );
}
