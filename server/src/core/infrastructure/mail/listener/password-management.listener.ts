import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { TokenService } from '../../../security/token/token.service';
import { Repository } from 'typeorm';
import { AccountLockedEmailContext, VerificationEmailContext, WelcomeEmailContext } from '../interfaces/mail-context.interface';
import { MailService } from '../mail.service';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Service } from '../../../../common/decorators/service.decorator';
import { Logger } from '@nestjs/common';
import { RegistrationEventListenerInterface } from './interfaces/registation-event-lisetener.interface';
import { Auth } from '../../../../modules/auth/entities/auth.entity';

@Service()
export class PasswordManagementEventListener implements PasswordManagementEventListenerInterface {

  private readonly logger = new Logger(PasswordManagementEventListener.name);
  constructor(
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
    @InjectRepository(Auth) // <--- ADD THIS DECORATOR    
    private readonly authRepository: Repository<Auth>,
    private readonly configService: ConfigService,
  ) {}

  @OnEvent('account.locked', { async: true }) // Runs in the background
  async handleAccountLockedEvent(auth: Auth) {
    const { email, user } = auth;


 
    // 3. Prepare the link
    const context: AccountLockedEmailContext = {
      firstName: user.firstName,
      email: email,
    };

    // 4. Dispatch Email
    await this.mailService.sendAccountLockedEmail(email, context);
    this.logger.log(`Account locked email dispatched to: ${email}`);
  }


}
