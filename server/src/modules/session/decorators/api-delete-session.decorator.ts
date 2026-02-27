import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiBody } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";


/** Delete Session (Logout/Revoke) */
export function ApiDeleteSession() {
  return applyDecorators(
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({ summary: 'Revoke session', description: 'Invalidates the refresh token and removes the session from the system (Logout).' }),
    ApiParam({ name: 'id', description: 'UUID of the session to revoke', type: String }),
    ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Session successfully revoked.' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Session not found or already deleted.' }),
    ...BearerAuthResponses
  );
}
