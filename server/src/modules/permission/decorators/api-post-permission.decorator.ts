import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiBody } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";
import { Permission } from "../entities/permission.entity";
import { CreatePermissionDto } from "../dto/create-permission.dto";
import { Action } from "../../../common/enums/action.enum";

/** Create Permission */
export function ApiPostPermission() {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    ApiOperation({ summary: 'Create new permission', description: 'Adds a new resource-action mapping to the system.' }),
    ApiBody({ type: CreatePermissionDto }),
    ApiResponse({ 
      status: HttpStatus.CREATED, 
      description: 'Permission created successfully.', 
      type: Permission,
      examples: {
        example1: {
          summary: 'New Permission Creation',
          value: { id: 10, resource: 'session', action: Action.DELETE, description: 'Revoke sessions' }
        }
      }
    }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid Resource or Action enum value provided.' }),
    ApiResponse({ status: HttpStatus.CONFLICT, description: 'A permission for this Resource-Action pair already exists.' }),
    ...BearerAuthResponses
  );
}
