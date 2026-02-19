import { Auth } from '../../../../../modules/auth/entities/auth.entity';

export interface PasswordManagementEventListenerInterface {
  handleForgotPasswordEvent(auth: Auth, generatedPassword: string): Promise<void>;
}