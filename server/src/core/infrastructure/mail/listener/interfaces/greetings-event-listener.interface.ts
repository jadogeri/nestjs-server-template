import { Auth } from '../../../../../modules/auth/entities/auth.entity';

export interface GreetingsEventListenerInterface {
  handleBirthdayEvent(auth: Auth): Promise<void>;
  handleAnniversaryEvent(auth: Auth, yearsCount: number): Promise<void>;
}