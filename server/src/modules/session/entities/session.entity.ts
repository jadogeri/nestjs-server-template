import { Auth } from "../../auth/entities/auth.entity";
import { BaseEntity, Entity, Column, ManyToOne, CreateDateColumn, PrimaryColumn, JoinColumn } from "typeorm";

@Entity('sessions')
export class Session extends BaseEntity{
  @PrimaryColumn({    
    type: 'varchar', 
    length: 36, 
    //generated: 'uuid' 
  })
  id: string;

  @Column()
  refreshTokenHash: string; 

  @Column()
  expiresAt: Date;

  @Column()
  @CreateDateColumn()  
  createdAt: Date;

  @ManyToOne(() => Auth, (auth) => auth.sessions, { onDelete: 'CASCADE' })
  @JoinColumn()
  auth: Auth;
}
