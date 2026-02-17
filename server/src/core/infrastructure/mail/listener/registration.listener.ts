import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { TokenService } from '../../../security/token/token.service';
import { Repository } from 'typeorm';
import { VerificationEmailContext } from '../interfaces/mail-context.interface';
import { MailService } from '../mail.service';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Service } from '../../../../common/decorators/service.decorator';
import { Logger } from '@nestjs/common';
import { RegistrationEventListenerInterface } from './interfaces/registation-event-lisetener.interface';
import { Auth } from '../../../../modules/auth/entities/auth.entity';

@Service()
export class RegistrationEventListener implements RegistrationEventListenerInterface {

  private readonly logger = new Logger(RegistrationEventListener.name);
  constructor(
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
    @InjectRepository(Auth) // <--- ADD THIS DECORATOR    
    private readonly authRepository: Repository<Auth>,
    private readonly configService: ConfigService,
  ) {}

  @OnEvent('user.registered', { async: true }) // Runs in the background
  async handleUserRegisteredEvent(auth: Auth) {
    const { email, id, user } = auth;

    // 1. Generate token
    const verificationToken = await this.tokenService.generateVerificationToken({ 
      sub: user.id, 
      userId: user.id, 
      email: email, 
      type: 'verification' 
    });

    // 2. Persist token
    await this.authRepository.update(id, { verificationToken });
 
    // 3. Prepare the link
    const appUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
    const context: VerificationEmailContext = {
      firstName: user.firstName,
      verificationLink: `${appUrl}/auth/verify-email?token=${verificationToken}`,
    };

    // 4. Dispatch Email
    await this.mailService.sendVerificationEmail(email, context);
    this.logger.log(`Verification email dispatched to: ${email}`);
  }
}
