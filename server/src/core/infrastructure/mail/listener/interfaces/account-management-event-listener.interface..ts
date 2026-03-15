import { Auth } from '../../../../../modules/auth/entities/auth.entity';

export interface AccountManagementEventListenerInterface {
  handleDeactivationEvent({auth, reactivateUrl}: {auth: Auth, reactivateUrl: string}): Promise<void>;
  handleReactivationEvent(auth: Auth): Promise<void>;
  handleDeletionEvent(auth: Auth): Promise<void>;
}