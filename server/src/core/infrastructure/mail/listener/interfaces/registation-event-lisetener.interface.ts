import { Auth } from '../../../../../modules/auth/entities/auth.entity';

export interface RegistrationEventListenerInterface {
  handleUserVerificationEvent(auth: Auth): Promise<void>;
  handleUserRegistrationEvent(auth: Auth): Promise<void>;
}