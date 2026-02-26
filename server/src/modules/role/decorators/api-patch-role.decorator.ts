import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { BearerAuthResponses } from "src/common/decorators/bearer-auth-responses.decorator";
import { Role } from "../entities/role.entity";

export function ApiPatchRole() {
  return applyDecorators(
    ApiOperation({ 
        summary: 'Update role',
        description: 'Updates specific fields of an existing role.' 
    }),
    ApiParam({ name: 'id', type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: 'Role updated successfully.', type: Role }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found.' }),
    ...BearerAuthResponses
  );
}