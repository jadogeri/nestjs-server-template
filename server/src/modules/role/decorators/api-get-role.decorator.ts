import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { BearerAuthResponses } from "src/common/decorators/bearer-auth-responses.decorator";
import { Role } from "../entities/role.entity";

export function ApiGetRole() {
  return applyDecorators(
    ApiOperation({ 
        summary: 'Get role by ID',
        description: 'Retrieves a single role including its associated permissions.' 
    }),
    ApiParam({ name: 'id', type: Number, description: 'The unique ID of the role' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Role found.', type: Role }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found.' }),
    ...BearerAuthResponses
  );
}
