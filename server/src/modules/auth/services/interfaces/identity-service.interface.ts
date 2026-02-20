import { RefreshTokenPayload } from "../../../../common/types/refresh-token-payload.type";
import { AccessTokenPayload } from "../../../../common/types/access-token-payload.type";
import { UserPayload } from "src/common/interfaces/user-payload.interface";

export abstract class IdentityServiceInterface {     

    abstract verifyUser(email: string, password: string): Promise< UserPayload | null> ;

    abstract verifyAccessToken(accessTokenPayload: AccessTokenPayload): Promise<AccessTokenPayload | null> ;

    abstract verifyRefreshToken(refreshTokenPayload: RefreshTokenPayload): Promise<RefreshTokenPayload | null> ;

}

