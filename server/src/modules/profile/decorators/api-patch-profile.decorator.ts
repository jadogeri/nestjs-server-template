import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiBody } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";
import { Profile } from "../entities/profile.entity";
import { CreateProfileDto } from "../dto/create-profile.dto";
import { UpdateProfileDto } from "../dto/update-profile.dto";


/** Update Profile (Partial) */
export function ApiPatchProfile() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Update profile', description: 'Modify specific fields of a profile. All fields are optional.' }),
    ApiParam({ name: 'id', description: 'ID of the profile to update', type: Number }),
    ApiBody({ 
      type: UpdateProfileDto,
      examples: {
        example1: {
          summary: 'Update Bio & Preferences',
          value: { bio: 'Senior Architect', preferences: { theme: 'light', lang: 'en' } }
        }
      }
    }),
    ApiResponse({ status: HttpStatus.OK, description: 'Profile updated successfully.', type: Profile }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validation failed for one or more fields.' }),
    ...BearerAuthResponses
  );
}
