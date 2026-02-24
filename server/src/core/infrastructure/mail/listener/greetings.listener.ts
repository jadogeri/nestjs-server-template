import { OnEvent } from '@nestjs/event-emitter';
import { AnniversaryEmailContext, BirthdayEmailContext} from '../interfaces/mail-context.interface';
import { MailService } from '../mail.service';
import { Service } from '../../../../common/decorators/service.decorator';
import { Logger } from '@nestjs/common';
import { Auth } from '../../../../modules/auth/entities/auth.entity';
import { GreetingsEventListenerInterface } from './interfaces/greetings-event-listener.interface';

@Service()
export class GreetingsEventListener implements GreetingsEventListenerInterface {

  private readonly logger = new Logger(GreetingsEventListener.name);
  constructor(
    private readonly mailService: MailService,
  ) {}

     @OnEvent('greetings.birthday', { async: true }) // Runs in the background
    async handleBirthdayEvent(auth: Auth): Promise<void> {
    console.log("auth details in event listener:", auth); // Debugging log
 
    // 3. Prepare the link
    const context: BirthdayEmailContext  = {
      firstName: auth.user.firstName,
    };

    console.log("Email context for birthday:", context); // Debugging log

    // 4. Dispatch Email
    await this.mailService.sendBirthdayEmail(auth.email, context);
    this.logger.log(`Birthday email dispatched to: ${auth.email}`);  }

    @OnEvent('greetings.anniversary', { async: true }) // Runs in the background

    async handleAnniversaryEvent(auth: Auth, yearsCount: number): Promise<void> {
    console.log("auth details in event listener:", auth); // Debugging log
 
    // 3. Prepare the link
    const context: AnniversaryEmailContext = {
      firstName: auth.user.firstName,
      yearsCount: yearsCount,
    };
    
    
    console.log("Email context for anniversary:", context); // Debugging log

    // 4. Dispatch Email
    await this.mailService.sendAnniversaryEmail(auth.email, context);
    this.logger.log(`Anniversary email dispatched to: ${auth.email}`);  }

}
