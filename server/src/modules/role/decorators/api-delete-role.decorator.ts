import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";
import { Role } from "../entities/role.entity";

export function ApiDeleteRole() {
  return applyDecorators(
    ApiOperation({ 
        summary: 'Delete role',
        description: 'Hard deletes a role. Note: This may fail if users are still assigned to this role.' 
    }),
    ApiParam({ name: 'id', type: Number }),
    ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Role deleted.' }),
    ApiResponse({ status: HttpStatus.CONFLICT, description: 'Cannot delete role while in use.' }),
    ...BearerAuthResponses
  );
}
