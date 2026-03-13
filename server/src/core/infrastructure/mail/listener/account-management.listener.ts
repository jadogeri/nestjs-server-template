import { OnEvent } from '@nestjs/event-emitter';
import { AnniversaryEmailContext, BirthdayEmailContext, DeactivationEmailContext} from '../interfaces/mail-context.interface';
import { MailService } from '../mail.service';
import { Service } from '../../../../common/decorators/service.decorator';
import { Logger } from '@nestjs/common';
import { Auth } from '../../../../modules/auth/entities/auth.entity';
import { GreetingsEventListenerInterface } from './interfaces/greetings-event-listener.interface';
import { AccountManagementEventListenerInterface } from './interfaces/account-management-event-listener.interface.';

@Service()
export class AccountManagementEventListener implements AccountManagementEventListenerInterface {

  private readonly logger = new Logger(AccountManagementEventListener.name);
  constructor(
    private readonly mailService: MailService,
  ) {}

    @OnEvent('account.deactivation', { async: true }) // Runs in the background
    async handleDeactivationEvent(auth: Auth): Promise<void> {
        console.log("auth details in event listener:", auth); // Debugging log
    
        // 3. Prepare the link
        const context: DeactivationEmailContext  = {
        firstName: auth.user.firstName,
        email: auth.email,
        confirmationDate: new Date(), // You can set this to the actual deactivation date if available
        };

        console.log("Email context for deactivation:", context); // Debugging log

        // 4. Dispatch Email
        await this.mailService.sendDeactivationEmail(auth.email, context);
        this.logger.log(`Deactivation email dispatched to: ${auth.email}`);  
    }

    @OnEvent('account.reactivation', { async: true }) // Runs in the background

        async handleReactivationEvent(auth: Auth): Promise<void> {
        console.log("auth details in event listener:", auth); // Debugging log
    
        // 3. Prepare the link
        const context: ReactivationEmailContext = {
        firstName: auth.user.firstName,
        email: auth.email,
        };
        
        
        console.log("Email context for reactivation:", context); // Debugging log

        // 4. Dispatch Email
        await this.mailService.sendReactivationEmail(auth.email, context);
        this.logger.log(`Reactivation email dispatched to: ${auth.email}`); 
    }


    @OnEvent('account.deletion', { async: true }) // Runs in the background

    async handleDeletionEvent(auth: Auth): Promise<void> {
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
