
export interface PasswordManagementServiceInterface {     

    forgotPassword(): Promise<void>;

    resetPassword(): Promise<void> ;
}

