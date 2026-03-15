import { Auth } from '../../../../../modules/auth/entities/auth.entity';

export interface AccountManagementEventListenerInterface {
  handleDeactivationEvent({auth, reactivateUrl}: {auth: Auth, reactivateUrl: string}): Promise<void>;
  handleReactivationRequestEvent({auth, reactivateLink}: {auth: Auth, reactivateLink: string}): Promise<void>;
  handleVerifyReactivationEvent({auth}: {auth: Auth} ): Promise<void>;
  handleDeletionEvent({auth}: {auth: Auth}): Promise<void>;
}