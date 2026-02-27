import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";

export function ApiDeleteRole() {
  return applyDecorators(
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({ 
        summary: 'Delete role',
        description: 'Hard deletes a role from the database. This action is irreversible.' 
    }),
    ApiParam({ name: 'id', type: Number, example: 1 }),
    ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Role successfully deleted.' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found.' }),
    ApiResponse({ 
      status: HttpStatus.CONFLICT, 
      description: 'Cannot delete role because it is currently assigned to one or more users.' 
    }),
    ...BearerAuthResponses
  );
}
