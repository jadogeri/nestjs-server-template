import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";
import { Role } from "../entities/role.entity";

export function ApiPostRole() {
  return applyDecorators(
    ApiOperation({ 
        summary: 'Create new role',
        description: 'Creates a new role with a unique name from the UserRole enum.' 
    }),
    ApiResponse({ status: HttpStatus.CREATED, description: 'The role has been successfully created.', type: Role }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input or role already exists.' }),
    ...BearerAuthResponses
  );
}
