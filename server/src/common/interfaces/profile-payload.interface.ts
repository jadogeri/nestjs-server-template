

// src/auth/interfaces/user-payload.interface.ts
export interface ProfilePayload {
  bio: string | null;
  avatarUrl: string | null;
  location: Record<string, any>; // Location is an Embedded Entity, don't use null
  website: string | null;
  socialMedia: Record<string, any> | null;
  gender: string | null;    
  preferences: Record<string, any> | null;

}
