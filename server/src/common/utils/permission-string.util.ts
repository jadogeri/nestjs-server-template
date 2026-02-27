
import { Action } from "../enums/action.enum";
import { PermissionString } from "../types/permission-string.type";

export class PermissionStringGeneratorUtil {
  // Utility methods for generating users can be added here

  static generate(resource: string, action: Action): PermissionString {
    const permissionString : PermissionString = `${resource}:${action}`;
    return permissionString;
    }
}   