export type TokenPayload = {
  userId: number;
  type: "access" | "refresh" | "verification";        
}