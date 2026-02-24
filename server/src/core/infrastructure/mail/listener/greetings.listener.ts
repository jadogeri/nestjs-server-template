import { OnEvent } from '@nestjs/event-emitter';
import { PasswordForgotEmailContext, PasswordResetEmailContext} from '../interfaces/mail-context.interface';
import { MailService } from '../mail.service';
import { Service } from '../../../../common/decorators/service.decorator';
import { Logger } from '@nestjs/common';
import { Auth } from '../../../../modules/auth/entities/auth.entity';
import { PasswordManagementEventListenerInterface } from './interfaces/password-management-event-lisetener.interface';
import { GreetingsEventListenerInterface } from './interfaces/greetings-event-listener.interface';

@Service()
export class GreetingsEventListener implements GreetingsEventListenerInterface {

  private readonly logger = new Logger(GreetingsEventListener.name);
  constructor(
    private readonly mailService: MailService,
  ) {}

  @OnEvent('password.forgot', { async: true }) // Runs in the background
  async handleForgotPasswordEvent(auth: Auth, generatedPassword: string){
    console.log("auth details in event listener:", auth); // Debugging log
 
    // 3. Prepare the link
    const context: PasswordForgotEmailContext = {
      firstName: auth.user.firstName,
      email: auth.email,
      temporaryPassword: generatedPassword,
      supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
    };

    console.log("Email context for password forgot:", context); // Debugging log

    // 4. Dispatch Email
    await this.mailService.sendPasswordForgotEmail(auth.email, context);
    this.logger.log(`Password forgot email dispatched to: ${auth.email}`);
  }

  @OnEvent('password.reset', { async: true }) // Runs in the background
  async handleResetPasswordEvent(auth: Auth){
    console.log("auth details in event listener:", auth); // Debugging log
 
    // 3. Prepare the link
    const context: PasswordResetEmailContext = {
      firstName: auth.user.firstName,
    };

    console.log("Email context for password reset:", context); // Debugging log

    // 4. Dispatch Email
    await this.mailService.sendPasswordResetEmail(auth.email, context);
    this.logger.log(`Password reset email dispatched to: ${auth.email}`);
  }

    @OnEvent('greetings.birthday', { async: true }) // Runs in the background

    async handleBirthdayEvent(auth: Auth): Promise<void> {
    throw new Error('Method not implemented.');
  }

    @OnEvent('greetings.anniversary', { async: true }) // Runs in the background

    async handleAnniversaryEvent(auth: Auth, yearsCount: number): Promise<void> {
      throw new Error('Method not implemented.');
  }

}
