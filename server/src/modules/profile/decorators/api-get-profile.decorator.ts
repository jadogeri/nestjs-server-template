import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiBody } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";
import { Profile } from "../entities/profile.entity";

/** Get Single Profile */
export function ApiGetProfile() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Get profile by ID', description: 'Fetch a specific user profile by its primary identifier.' }),
    ApiParam({ name: 'id', description: 'The unique ID of the profile', type: Number, example: 1 }),
    ApiResponse({ 
      status: HttpStatus.OK, 
      description: 'Profile found.', 
      type: Profile,
      examples: {
        example1: {
          summary: 'Full Profile View',
          value: { id: 1, bio: 'Artist', website: 'https://art.com', socialMedia: '@artist_js' }
        }
      }
    }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Profile with the given ID does not exist.' }),
    ...BearerAuthResponses
  );
}


