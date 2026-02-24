
import { Expose } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToMany, JoinTable, OneToMany, ValueTransformer } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // Added import
import { Profile } from '../../profile/entities/profile.entity';
import { Auth } from '../../auth/entities/auth.entity';
import { Role } from '../../role/entities/role.entity';
import { Audit } from '../../../common/entities/audit.entity';
import { IsName } from '../../../common/decorators/validators/is-name.decorator';
import { Contact } from '../../contact/entities/contact.entity';
import  moment from 'moment';

export const DateTransformer: ValueTransformer = {
  // When saving to SQLite: Convert Date object to 'YYYY-MM-DD' string
  to: (value: Date | string) => {
    if (!value) return value;
    const date = typeof value === 'string' ? new Date(value) : value;
    return date.toISOString().split('T')[0]; // Result: "1990-02-23"
  },
  // When reading from SQLite: Convert 'YYYY-MM-DD' string back to UTC Date object
  from: (value: string) => {
    if (!value) return value;
    // Adding 'T00:00:00Z' forces JS to treat it as UTC Midnight
    return new Date(`${value}T00:00:00Z`);
  },
};


@Entity("users")
export class User extends Audit {
  @ApiProperty({ example: 1, description: 'The unique identifier of the user' })
  @PrimaryGeneratedColumn()
  id: number;
  
  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  @Column({ type: 'varchar', length: 100 })
  @IsName('FirstName')
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  @Column({ type: 'varchar', length: 100 })
  @IsName('LastName')
  lastName: string;

  @Column({ type: 'date', nullable: true, transformer: DateTransformer })
  dateOfBirth: Date;
  
  // Virtual Property
  @ApiProperty({ example: 'John Doe', description: 'The combined first and last name' })
  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true }) 
  profile: Profile;

  @OneToOne(() => Auth, (auth) => auth.user)
  auth: Auth;

  @ManyToMany(() => Role, (role: Role) => role.users, { cascade: true })
  @JoinTable({ 
    name: 'users_roles',
    joinColumn: {
      name: 'userId',            // The column name for the User ID
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'roleId',            // The column name for the Role ID
      referencedColumnName: 'id'
    }
  })
  roles: Role[];

  @OneToMany(() => Contact, (contact) => contact.user)
  contacts: Contact[];

}