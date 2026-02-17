
export abstract class AccountManagementServiceInterface {     

    abstract deactivate(): Promise<void>;

    abstract delete(): Promise<void> ;

    abstract reactivate(): Promise<void>;
}

