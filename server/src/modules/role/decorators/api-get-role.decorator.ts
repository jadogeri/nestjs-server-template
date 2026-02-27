import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";
import { Role } from "../entities/role.entity";

export function ApiGetRole() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOperation({ 
        summary: 'Get role by ID',
        description: 'Retrieves a single role including its associated permissions and details.' 
    }),
    ApiParam({ name: 'id', type: Number, description: 'The unique ID of the role', example: 1 }),
    ApiResponse({ 
      status: HttpStatus.OK, 
      description: 'Role found.', 
      type: Role,
      examples: { 
        example1: { 
          summary: 'Standard Role Found', 
          value: { 
            id: 1, 
            name: 'admin', 
            description: 'Full system access' 
          } 
        } 
      }
    }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role with the specified ID does not exist.' }),
    ...BearerAuthResponses
  );
}
