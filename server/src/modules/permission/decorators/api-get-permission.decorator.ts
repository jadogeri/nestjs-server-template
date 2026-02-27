import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiBody } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";
import { Permission } from "../entities/permission.entity";
import { Resource } from "../../../common/enums/resource.enum";
import { Action } from "../../../common/enums/action.enum";


/** Get Single Permission */
export function ApiGetPermission() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Get permission by ID', description: 'Fetch a specific permission mapping using its unique ID.' }),
    ApiParam({ name: 'id', description: 'The unique identifier of the permission', type: Number, example: 1 }),
    ApiResponse({ 
      status: HttpStatus.OK, 
      description: 'Permission found.', 
      type: Permission,
      examples: {
        example1: {
          summary: 'Specific Permission Detail',
          value: { id: 1, resource: Resource.USER, action: Action.READ, description: 'View user details' }
        }
      }
    }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Permission with the specified ID does not exist.' }),
    ...BearerAuthResponses
  );
}
