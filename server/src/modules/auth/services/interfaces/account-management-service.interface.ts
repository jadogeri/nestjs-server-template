
export interface AccountManagementServiceInterface {     

    deactivate(): Promise<void>;

    delete(): Promise<void> ;

    reactivate(): Promise<void>;
}

