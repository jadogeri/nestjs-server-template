import { TokenPayload } from "./token-payload.type";

export type ReactivationTokenPayload = TokenPayload & {
  email: string; 
  type: "reactivation";
}