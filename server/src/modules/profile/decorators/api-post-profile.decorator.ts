import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiBody } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";
import { Profile } from "../entities/profile.entity";
import { CreateProfileDto } from "../dto/create-profile.dto";
import { UpdateProfileDto } from "../dto/update-profile.dto";

/** Create Profile */
export function ApiPostProfile() {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    ApiOperation({ summary: 'Create new profile', description: 'Initializes a profile for a user.' }),
    ApiBody({ type: CreateProfileDto }),
    ApiResponse({ status: HttpStatus.CREATED, description: 'Profile created successfully.', type: Profile }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data format or missing required fields.' }),
    ApiResponse({ status: HttpStatus.CONFLICT, description: 'A profile already exists for this user.' }),
    ...BearerAuthResponses
  );
}

