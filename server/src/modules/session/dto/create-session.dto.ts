import { Auth } from "../../../modules/auth/entities/auth.entity";

export class CreateSessionDto {
    id: string;
    refreshTokenHash: string;
    expiresAt?: Date;
    auth: Auth
}
    