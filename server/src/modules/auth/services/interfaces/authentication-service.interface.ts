import { UserPayload } from "../../../../common/interfaces/user-payload.interface";
import { Response } from "express";
import { RefreshTokenPayload } from "../../../../common/types/refresh-token-payload.type";

export interface AuthenticationServiceInterface {     

    login(res: Response<any, Record<string, any>>, userPayload: UserPayload): Promise<any>;

    logout(token: string): Promise<void> ;

    refreshToken(refreshTokenPayload: RefreshTokenPayload, res: Response<any, Record<string, any>>): Promise<any>;
}