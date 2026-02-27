import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";
import { Role } from "../entities/role.entity";
import { CreateRoleDto } from "../dto/create-role.dto";
import { permission } from "process";

export function ApiPostRole() {
  return applyDecorators(
    ApiOperation({ 
        summary: 'Create new role',
        description: 'Creates a new role with a unique name. Ensure the name does not already exist in the database.' 
    }),
    ApiBody({ 
      description: 'Role details',
      type: CreateRoleDto,
      examples: {
        example1: {
          summary: 'Standard Role Creation',  
          value: {
            name: 'manager',
            description: 'Can manage user content'
          }
        }
      },
    }),
    ApiResponse({ 
      status: HttpStatus.CREATED, 
      description: 'The role has been successfully created.', 
      type: Role,
      examples: {
        example1: {
          summary: 'Created Role',
          value: {  
            id: 1,
            name: 'manager',
            description: 'Can manage user content', 
            permissionIds: [1, 2, 3] // Example permission IDs associated with this role  
          }
        }
      }
    }),
    ApiResponse({ 
      status: HttpStatus.BAD_REQUEST, 
      description: 'Invalid input data.' 
    }),
    ApiResponse({ 
      status: HttpStatus.CONFLICT, 
      description: 'Role name already exists.' 
    }),
    ...BearerAuthResponses
  );
}
