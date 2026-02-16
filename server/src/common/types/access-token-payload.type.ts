import { UserPayload } from "../interfaces/user-payload.interface";
import { TokenPayload } from "./token-payload.type";

export type AccessTokenPayload = TokenPayload & Pick<UserPayload, 'userId' | 'permissions' | 'email' | 'roles'> & {
  sub?: number;   
}

