import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiBody } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";
import { Session } from "../entities/session.entity";
import { UpdateSessionDto } from "../dto/update-session.dto"; // Assuming PartialType(CreateSessionDto)


/** Update Session */
export function ApiPatchSession() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Update session', description: 'Modify session attributes like expiration time or refresh token hash.' }),
    ApiParam({ name: 'id', description: 'UUID of the session to update', type: String }),
    ApiBody({ 
      type: UpdateSessionDto,
      examples: {
        example1: {
          summary: 'Extend Session Expiration',
          value: { expiresAt: '2025-01-15T10:00:00.000Z' }
        }
      }
    }),
    ApiResponse({ status: HttpStatus.OK, description: 'Session updated successfully.', type: Session }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Not authorized to modify this session.' }),
    ...BearerAuthResponses
  );
}

