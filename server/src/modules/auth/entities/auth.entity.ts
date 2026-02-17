import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Session } from '../../session/entities/session.entity';
import { Audit } from '../../../common/entities/audit.entity';
import { IsUserEmail } from '../../../common/decorators/validators/is-email.decorator';
import { IsSecuredPassword } from '../../../common/decorators/validators/is-secured-password.decorator';

@Entity("auths")
export class Auth extends Audit {
  @ApiProperty({ example: 1, description: 'The unique identifier of the auth record' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'john.doe@example.com', description: 'The unique email of the user' })
  @Column({ unique: true, type: 'varchar', length: 150 })
  @IsUserEmail() 
  email: string;

  //@Exclude({ toPlainOnly: true, toClassOnly: true }) // 👈 Exclude from serialization
  @Column()
  @IsSecuredPassword()
  password: string;

  @Column({ default: false }) // 👈 Set to false to "ban" or deactivate an account
  isEnabled: boolean;

  @Column({type: 'varchar', nullable: true, default: null }) // 👈 Set to false to "ban" or deactivate an account
  verificationToken: string | null;

  @Column({ default: false })
  isVerified: boolean;
  
  @Column({ type: 'datetime', nullable: true, default: null })
  verifiedAt: Date;

  @Column({ type: 'datetime', nullable: true, default: null })
  lastLoginAt: Date;

  @Column({ default: 0 })
  failedLoginAttempts: number;

  @OneToOne(() => User, (user) => user.auth, { onDelete: 'CASCADE', cascade: true }) // CRITICAL: This allows saving User via Auth
  @JoinColumn({ name: 'userId' })
  user: User;

  // In your Auth entity file (e.g., auth.entity.ts)
  @OneToMany(() => Session, (session) => session.auth)
  sessions: Session[];
  
}










