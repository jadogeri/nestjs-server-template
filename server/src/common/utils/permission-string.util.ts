
import { Action } from "../enums/action.enum";
import { PermissionString } from "../types/permission-string.type";
import { Resource } from "../types/resource.type";

export class PermissionStringGeneratorUtil {
  // Utility methods for generating users can be added here

  static generate(resource: Resource, action: Action): PermissionString {
    const permissionString : PermissionString = `${resource}:${action}`;
    return permissionString;
  }

  static extract(permissionString: PermissionString): { resource: Resource; action: Action } {
    const [resource, action] = permissionString.split(':') as [Resource, Action];
    return { resource, action };
  }
}   