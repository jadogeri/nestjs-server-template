import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiBody } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";
import { Session } from "../entities/session.entity";
import { CreateSessionDto } from "../dto/create-session.dto";

/** Create Session (Login/Token Refresh) */
export function ApiPostSession() {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    ApiOperation({ summary: 'Create new session', description: 'Registers a new session (usually called during login or token exchange).' }),
    ApiBody({ type: CreateSessionDto }),
    ApiResponse({ status: HttpStatus.CREATED, description: 'Session created successfully.', type: Session }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid UUID or malformed token hash.' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials provided for session creation.' }),
    ...BearerAuthResponses
  );
}

