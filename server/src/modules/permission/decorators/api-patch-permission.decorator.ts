import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiBody } from "@nestjs/swagger";
import { BearerAuthResponses } from "../../../common/decorators/bearer-auth-responses.decorator";
import { Permission } from "../entities/permission.entity";
import { UpdatePermissionDto } from "../dto/update-permission.dto";




/** Update Permission */
export function ApiPatchPermission() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Update permission', description: 'Modify the description, resource, or action of an existing permission.' }),
    ApiParam({ name: 'id', description: 'ID of the permission to update', type: Number }),
    ApiBody({ type: UpdatePermissionDto }),
    ApiResponse({ 
      status: HttpStatus.OK, 
      description: 'Permission updated successfully.', 
      type: Permission,
      examples: {
        example1: {
          summary: 'Update Description',
          value: { description: 'Updated access level for user management' }
        }
      }
    }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Permission not found.' }),
    ...BearerAuthResponses
  );
}
