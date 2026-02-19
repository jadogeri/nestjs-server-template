
export abstract class PasswordManagementServiceInterface {     

    abstract forgotPassword(email: string): Promise<any>;

    abstract resetPassword(): Promise<void> ;
}

