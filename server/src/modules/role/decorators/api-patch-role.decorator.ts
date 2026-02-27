import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";
import { Role } from "../entities/role.entity";
import { UpdateRoleDto } from "../dto/update-role.dto";
import { permission } from "process";

export function ApiPatchRole() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOperation({ 
        summary: 'Update role',
        description: 'Updates specific fields of an existing role by ID.' 
    }),
    ApiParam({ name: 'id', type: Number, example: 1 }),
    ApiBody({ 
      type: UpdateRoleDto,
      description: 'Fields to update',
      examples: { 
        example1: { 
          summary: 'Updated access level description',
          value: {
            name: 'developer',
            description: 'developer role with permissions to manage code repositories',
            permissionIds: [1, 2, 3] // Example permission IDs associated with this role
          }
        }
      }
    }),
    ApiResponse({ 
      status: HttpStatus.OK, 
      description: 'Role updated successfully.', 
      type: Role,
      examples: {
        example1: {
          summary: 'Updated Role',
          value: {  
            id: 1,
            name: 'developer',
            description: 'developer role with permissions to manage code repositories', 
            permissionIds: [1, 2, 3] // Example permission IDs associated with this role  
          }
        }
      }
    }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found.' }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid payload.' }),
    ...BearerAuthResponses
  );
}
