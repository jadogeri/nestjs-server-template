
export abstract class PasswordManagementServiceInterface {     

    abstract forgotPassword(email: string): Promise<void>;

    abstract resetPassword(): Promise<void> ;
}

