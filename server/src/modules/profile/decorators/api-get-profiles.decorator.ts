import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiBody } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";
import { Profile } from "../entities/profile.entity";
import { CreateProfileDto } from "../dto/create-profile.dto";
import { UpdateProfileDto } from "../dto/update-profile.dto";

/** Get All Profiles */
export function ApiGetProfiles() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOperation({ 
      summary: 'Get all profiles', 
      description: 'Retrieves a list of all user profiles including bio, location, and preferences.' 
    }),
    ApiResponse({ 
      status: HttpStatus.OK, 
      description: 'Profiles retrieved successfully.', 
      type: [Profile],
      examples: {
        example1: {
          summary: 'Standard Profiles List',
          value: [{ id: 1, bio: 'Tech Lead', location: { city: 'NY', country: 'US' }, preferences: { theme: 'dark' } }]
        }
      }
    }),
    ...BearerAuthResponses
  );
}

