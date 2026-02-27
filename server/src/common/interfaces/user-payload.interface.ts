import { PermissionString } from "../types/permission-string.type";

// src/auth/interfaces/user-payload.interface.ts
export interface UserPayload {
  userId: number; // From auth table
  email: string; // From auth table
  roles: string[]; // From user/roles table
  permissions: PermissionString[]; // From user/permissions table
}
