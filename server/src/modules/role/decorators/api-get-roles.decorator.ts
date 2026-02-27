import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { BearerAuthResponses } from "src/common/decorators/bearer-auth-responses.decorator";
import { Role } from "../entities/role.entity";

export function ApiGetRoles() {
  return applyDecorators(
    ApiOperation({ 
        summary: 'Get all roles',
        description: 'Retrieves a list of all available user roles.' 
    }),
    ApiResponse({ status: HttpStatus.OK, description: 'List of roles.', type: [Role] }),
    ...BearerAuthResponses
  );
}
