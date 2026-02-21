import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

import { BearerAuthResponses } from '../../../common/decorators/bearer-auth-responses.decorator';

export function ApiDeleteContact() {
  return applyDecorators(
    ApiOperation({ 
        summary: 'Hard delete contact',
        description: 'Deletes a specific contact by ID.'
    }),
    ApiParam({ name: 'id', type: Number }),
    ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Deleted.' }),
    ...BearerAuthResponses
  );
}
