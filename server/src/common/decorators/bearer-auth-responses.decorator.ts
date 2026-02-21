import { HttpStatus } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse } from "@nestjs/swagger";

export const BearerAuthResponses = [
  ApiBearerAuth(),
  ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized: Missing or invalid Bearer token.' }),
  ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden: You do not have permission to perform this action.' }),
];
    