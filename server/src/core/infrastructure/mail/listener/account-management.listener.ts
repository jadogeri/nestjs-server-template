import { OnEvent } from '@nestjs/event-emitter';
import { 
    DeactivationEmailContext, 
    DeletionEmailContext, 
    ReactivationRequestEmailContext,
    VerifiedReactivationEmailContext} from '../interfaces/mail-context.interface';
import { MailService } from '../mail.service';
import { Service } from '../../../../common/decorators/service.decorator';
import { Logger } from '@nestjs/common';
import { Auth } from '../../../../modules/auth/entities/auth.entity';
import { AccountManagementEventListenerInterface } from './interfaces/account-management-event-listener.interface.';

@Service()
export class AccountManagementEventListener implements AccountManagementEventListenerInterface {

  private readonly logger = new Logger(AccountManagementEventListener.name);
  constructor(
    private readonly mailService: MailService,
  ) {}

    @OnEvent('account.deactivation', { async: true }) // Runs in the background
    async handleDeactivationEvent({auth, reactivateUrl}: {auth: Auth, reactivateUrl: string}): Promise<void> {
        console.log("auth details in event listener:", auth); // Debugging log
    
        // 3. Prepare the link
        const context: DeactivationEmailContext  = {
        firstName: auth.user.firstName,
        email: auth.email,
        confirmationDate: new Date(), // You can set this to the actual deactivation date if available
        reactivateUrl: reactivateUrl, // Pass the reactivation URL to the email context

        };

        console.log("Email context for deactivation:", context); // Debugging log

        // 4. Dispatch Email
        await this.mailService.sendDeactivationEmail(auth.email, context);
        this.logger.log(`Deactivation email dispatched to: ${auth.email}`);  
    }

    @OnEvent('account.reactivate-request', { async: true }) // Runs in the background

        async handleReactivationRequestEvent({auth, reactivateLink}: {auth: Auth, reactivateLink: string}): Promise<void> {
        console.log("auth details in event listener:", auth); // Debugging log
    
        // 3. Prepare the link
        const context: ReactivationRequestEmailContext = {
        firstName: auth.user.firstName,
        email: auth.email,
        reactivateLink: reactivateLink,
        };
        
        
        console.log("Email context for reactivation:", context); // Debugging log

        // 4. Dispatch Email
        await this.mailService.sendReactivationRequestEmail(auth.email, context);
        this.logger.log(`Reactivation email dispatched to: ${auth.email}`); 
    }

    
    @OnEvent('account.verified-reactivation', { async: true }) // Runs in the background

        async handleVerifyReactivationEvent({auth}: {auth: Auth}): Promise<void> {
        console.log("auth details in event listener:", auth); // Debugging log
    
        // 3. Prepare the link
        const context: VerifiedReactivationEmailContext = {
        firstName: auth.user.firstName,
        email: auth.email,
        };
        
        
        console.log("Email context for reactivation:", context); // Debugging log

        // 4. Dispatch Email
        await this.mailService.sendVerifiedReactivationEmail(auth.email, context);
        this.logger.log(`Reactivation email dispatched to: ${auth.email}`); 
    }

    @OnEvent('account.deletion', { async: true }) // Runs in the background

    async handleDeletionEvent({auth}: {auth: Auth}): Promise<void> {
    console.log("auth details in event listener:", auth); // Debugging log
 
    // 3. Prepare the link
    const context: DeletionEmailContext = {
      firstName: auth.user.firstName,
      email: auth.email,
    };
    
    
    console.log("Email context for deletion:", context); // Debugging log

    // 4. Dispatch Email
    await this.mailService.sendDeletionEmail(auth.email, context);
    this.logger.log(`Deletion email dispatched to: ${auth.email}`);
  }




}
