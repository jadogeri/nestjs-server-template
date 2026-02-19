export abstract class IdentityServiceInterface {     

    abstract verifyUser(): Promise<any>;

    abstract verifyAccessToken(): Promise<any> ;

    abstract verifyRefreshToken(): Promise<any> ;

}

