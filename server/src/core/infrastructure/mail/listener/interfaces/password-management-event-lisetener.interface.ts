import { Auth } from '../../../../../modules/auth/entities/auth.entity';

export interface PasswordManagementEventListenerInterface {
  handleAccountLockedEvent({auth, generatedPassword}: {auth: Auth, generatedPassword: string}): Promise<void>;
}