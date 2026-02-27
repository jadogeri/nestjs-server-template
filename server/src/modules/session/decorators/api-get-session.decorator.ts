import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiBody } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";
import { Session } from "../entities/session.entity";
import { CreateSessionDto } from "../dto/create-session.dto";
import { UpdateSessionDto } from "../dto/update-session.dto"; // Assuming PartialType(CreateSessionDto)


/** Get Single Session */
export function ApiGetSession() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Get session by ID', description: 'Retrieve metadata for a specific session UUID.' }),
    ApiParam({ name: 'id', description: 'The unique UUID of the session', type: String, example: '550e8400-e29b-41d4-a716-446655440000' }),
    ApiResponse({ 
      status: HttpStatus.OK, 
      description: 'Session details found.', 
      type: Session,
      examples: {
        example1: {
          summary: 'Single Session Detail',
          value: { id: '550e8400-e29b-41d4-a716-446655440000', expiresAt: '2024-12-31T23:59:59.000Z' }
        }
      }
    }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Session ID not found or already expired.' }),
    ...BearerAuthResponses
  );
}

