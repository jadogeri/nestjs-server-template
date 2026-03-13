import { Auth } from '../../../../../modules/auth/entities/auth.entity';

export interface AccountManagementEventListenerInterface {
  handleDeactivationEvent(auth: Auth): Promise<void>;
  handleReactivationEvent(auth: Auth): Promise<void>;
  handleDeletionEvent(auth: Auth): Promise<void>;
}