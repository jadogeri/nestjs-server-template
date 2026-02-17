import { Service } from "../../../common/decorators/service.decorator";
import { PasswordManagementServiceInterface } from "./interfaces/password-management-service.interface";

@Service()
export class PasswordManagementService implements PasswordManagementServiceInterface {
    async forgotPassword(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async resetPassword(): Promise<void> {
        throw new Error("Method not implemented.");
    }    

}