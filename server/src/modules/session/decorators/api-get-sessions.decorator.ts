import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiBody } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";
import { Session } from "../entities/session.entity";

/** Get All Sessions */
export function ApiGetSessions() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOperation({ 
      summary: 'Get all active sessions', 
      description: 'Retrieves a list of all active login sessions for the authenticated user/system.' 
    }),
    ApiResponse({ 
      status: HttpStatus.OK, 
      description: 'Sessions retrieved successfully.', 
      type: [Session],
      examples: {
        example1: {
          summary: 'Active Session List',
          value: [
            { 
              id: '550e8400-e29b-41d4-a716-446655440000', 
              expiresAt: '2024-12-31T23:59:59.000Z',
              createdAt: '2024-01-01T12:00:00.000Z'
            }
          ]
        }
      }
    }),
    ...BearerAuthResponses
  );
}

