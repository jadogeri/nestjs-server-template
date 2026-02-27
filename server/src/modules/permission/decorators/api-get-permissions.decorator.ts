import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiBody } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";
import { Permission } from "../entities/permission.entity";
import { Resource } from "../../../common/enums/resource.enum";
import { Action } from "../../../common/enums/action.enum";

/** Get All Permissions */
export function ApiGetPermissions() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOperation({ 
      summary: 'Get all permissions', 
      description: 'Retrieves a list of all available resource-action permission mappings.' 
    }),
    ApiResponse({ 
      status: HttpStatus.OK, 
      description: 'Permissions retrieved successfully.', 
      type: [Permission],
      examples: {
        example1: {
          summary: 'Standard Permission List',
          value: [
            { id: 1, resource: Resource.USER, action: Action.CREATE, description: 'Allows creating users' },
            { id: 2, resource: Resource.AUTH, action: Action.ALL, description: 'Full auth access' }
          ]
        }
      }
    }),
    ...BearerAuthResponses
  );
}
