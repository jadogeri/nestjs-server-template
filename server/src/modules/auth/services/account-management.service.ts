import { Service } from "../../../common/decorators/service.decorator";
import { AccountManagementServiceInterface } from "./interfaces/account-management-service.interface";

@Service()
export class AccountManagementService implements AccountManagementServiceInterface {
    async deactivate(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async delete(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async reactivate(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}