import { Action } from "../enums/action.enum";
import { Resource } from "./resource.type";

export type PermissionString = `${Resource}:${Action}`;