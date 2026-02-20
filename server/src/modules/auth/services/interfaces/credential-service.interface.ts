import { UserPayload } from "../../../../common/interfaces/user-payload.interface";
import { Response } from "express";
import { RefreshTokenPayload } from "../../../../common/types/refresh-token-payload.type";
import { AccessTokenPayload } from "../../../../common/types/access-token-payload.type";

export abstract class CredentialServiceInterface {     

    abstract login(res: Response<any, Record<string, any>>, userPayload: UserPayload): Promise<any>;

    abstract logout(res: Response<any, Record<string, any>>, refreshTokenPayload: RefreshTokenPayload): Promise<any>;

    abstract refreshToken(refreshTokenPayload: RefreshTokenPayload, res: Response<any, Record<string, any>>): Promise<any>;

}