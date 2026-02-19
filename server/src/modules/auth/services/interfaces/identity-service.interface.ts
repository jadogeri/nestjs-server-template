import { RefreshTokenPayload } from "../../../../common/types/refresh-token-payload.type";
import { AccessTokenPayload } from "../../../../common/types/access-token-payload.type";

export abstract class IdentityServiceInterface {     

    abstract verifyUser(): Promise<any>;

    abstract verifyAccessToken(accessTokenPayload: AccessTokenPayload): Promise<AccessTokenPayload | null> ;

    abstract verifyRefreshToken(refreshTokenPayload: RefreshTokenPayload): Promise<RefreshTokenPayload | null> ;

}

