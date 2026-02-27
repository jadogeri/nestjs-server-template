import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, ManyToMany } from 'typeorm';
import { Resource } from '../../../common/enums/resource.enum';
import { Action } from '../../../common/enums/action.enum';
import { Role } from '../../../modules/role/entities/role.entity';


@Entity('permissions')
@Unique(['resource', 'action']) // Composite unique constraint
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar', // Changed from simple-enum to varchar
    default: 'auth', // Default value is now a plain string
  })
  resource: string; // Type changed to string

  @Column({
    type: 'simple-enum',
    enum: Action,
    default: Action.READ,
  })
  action: Action;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @ManyToMany(() => Role, (role: Role) => role.permissions)
  roles: Role[];    
  
}
