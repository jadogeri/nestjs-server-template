import { TokenPayload } from "./token-payload.type";

export type VerificationTokenPayload = TokenPayload & {
  email: string; 
  sub?: number;      
}