import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiBody } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";

/** Delete Permission */
export function ApiDeletePermission() {
  return applyDecorators(
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({ summary: 'Delete permission', description: 'Permanently removes a permission mapping. Warning: This may affect roles assigned to this permission.' }),
    ApiParam({ name: 'id', description: 'ID of the permission to remove', type: Number }),
    ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Permission successfully deleted.' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Insufficient privileges to delete system permissions.' }),
    ...BearerAuthResponses
  );
}
