import { OnEvent } from '@nestjs/event-emitter';
import { PasswordResetEmailContext} from '../interfaces/mail-context.interface';
import { MailService } from '../mail.service';
import { Service } from '../../../../common/decorators/service.decorator';
import { Logger } from '@nestjs/common';
import { Auth } from '../../../../modules/auth/entities/auth.entity';
import { PasswordManagementEventListenerInterface } from './interfaces/password-management-event-lisetener.interface';

@Service()
export class PasswordManagementEventListener implements PasswordManagementEventListenerInterface {

  private readonly logger = new Logger(PasswordManagementEventListener.name);
  constructor(
    private readonly mailService: MailService,
  ) {}

  @OnEvent('password.reset', { async: true }) // Runs in the background
  async handleAccountLockedEvent({auth, generatedPassword}: {auth: Auth, generatedPassword: string}) {
    const { email, user } = auth;
 
    // 3. Prepare the link
    const context: PasswordResetEmailContext = {
      firstName: user.firstName,
      email: email,
      generatedPassword: generatedPassword,
    };

    // 4. Dispatch Email
    await this.mailService.sendPasswordResetEmail(email, context);
    this.logger.log(`Password reset email dispatched to: ${email}`);
  }

}
