import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiBody } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";
import { Profile } from "../entities/profile.entity";
import { CreateProfileDto } from "../dto/create-profile.dto";
import { UpdateProfileDto } from "../dto/update-profile.dto";

/** Delete Profile */
export function ApiDeleteProfile() {
  return applyDecorators(
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({ summary: 'Delete profile', description: 'Permanently deletes the profile record.' }),
    ApiParam({ name: 'id', description: 'ID of the profile to remove', type: Number }),
    ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Profile deleted successfully.' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'You do not have permission to delete this profile.' }),
    ...BearerAuthResponses
  );
}
