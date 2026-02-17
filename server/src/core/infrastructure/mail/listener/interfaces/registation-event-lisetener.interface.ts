import { Auth } from '../../../../../modules/auth/entities/auth.entity';

export interface RegistrationEventListenerInterface {
  handleUserRegisteredEvent(auth: Auth): Promise<void>;
}