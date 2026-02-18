import { Response } from "express";
import { UserPayload } from "../../../common/interfaces/user-payload.interface";
import { RefreshTokenPayload } from "../../../common/types/refresh-token-payload.type";
import { Service } from "../../../common/decorators/service.decorator";
import { AuthenticationServiceInterface } from "./interfaces/authentication-service.interface";


@Service()
export class AuthenticationService implements AuthenticationServiceInterface {
    login(res: Response<any, Record<string, any>>, userPayload: UserPayload): Promise<any> {
        throw new Error("Method not implemented.");
    }
    logout(token: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    refreshToken(refreshTokenPayload: RefreshTokenPayload, res: Response<any, Record<string, any>>): Promise<any> {
        throw new Error("Method not implemented.");
    }     


}