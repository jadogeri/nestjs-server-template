import { TokenPayload } from "./token-payload.type";

export type RefreshTokenPayload = TokenPayload  & {
  sub?: number;   
  type: 'refresh'; 
  sessionId: string; 
}

