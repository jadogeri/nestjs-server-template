import { Response } from "express";
import { AccessTokenPayload } from "../../../../common/types/access-token-payload.type";

export abstract class AccountManagementServiceInterface {
    abstract verifyReactivation(reactivationToken: any): Promise<void>;
    abstract requestReactivation(email: string): Promise<void>;

    abstract deactivate(res: Response<any, Record<string, any>>, accessTokenPayload: AccessTokenPayload): Promise<void>;

    abstract delete(): Promise<void> ;

    abstract reactivate(): Promise<void>;
}

