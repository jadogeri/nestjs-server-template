import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiBody } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";


/** Delete User */
export function ApiDeleteUser() {
  return applyDecorators(
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({ summary: 'Delete user', description: 'Permanently removes a user and their associated data from the system.' }),
    ApiParam({ name: 'id', description: 'ID of the user to delete', type: Number }),
    ApiResponse({ 
      status: HttpStatus.NO_CONTENT, 
      description: 'User successfully deleted. No content returned.' 
    }),
    ...BearerAuthResponses
  );
}
