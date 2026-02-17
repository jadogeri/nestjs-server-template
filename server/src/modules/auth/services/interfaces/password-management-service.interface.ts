
export abstract class PasswordManagementServiceInterface {     

    abstract forgotPassword(): Promise<void>;

    abstract resetPassword(): Promise<void> ;
}

