import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";
import { Role } from "../entities/role.entity";

export function ApiGetRoles() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOperation({ 
        summary: 'Get all roles',
        description: 'Retrieves a list of all available user roles in the system.' 
    }),
    ApiResponse({ 
      status: HttpStatus.OK, 
      description: 'List of roles retrieved successfully.', 
      type: [Role],
      examples: {
        example1: {
          summary: 'Standard Roles List',
          value: [
            { id: 1, name: 'admin', description: 'Full system access' },
            { id: 2, name: 'user', description: 'Standard access' }
          ]
        }
      }
    }),
    ...BearerAuthResponses
  );
}
