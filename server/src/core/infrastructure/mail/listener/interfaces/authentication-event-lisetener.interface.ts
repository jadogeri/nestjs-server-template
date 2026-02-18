import { Auth } from '../../../../../modules/auth/entities/auth.entity';

export interface AuthenticationEventListenerInterface {
  handleAccountLockedEvent(auth: Auth): Promise<void>;
}