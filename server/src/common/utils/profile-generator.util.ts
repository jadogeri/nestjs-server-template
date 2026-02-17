import { Profile } from "../../modules/profile/entities/profile.entity";

export class ProfileGeneratorUtil {
    static generate(payload?: any): Profile {
        const profile = new Profile();
        
        return Object.assign(profile, {
            bio: payload?.bio || null,
            avatarUrl: payload?.avatarUrl || null,
            location: payload?.location || {}, // Location is an Embedded Entity, don't use null
            website: payload?.website || null,
            socialMedia: payload?.socialMedia || null,
            gender: payload?.gender || null,
            preferences: payload?.preferences || {},
        });
    }
}


