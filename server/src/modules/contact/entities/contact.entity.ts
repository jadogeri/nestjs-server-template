import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm";
import { Location } from "../../../common/entities/location.entity";
import { Audit } from "../../../common/entities/audit.entity";
import { Matches } from "class-validator";
import { User } from "../../user/entities/user.entity";

@Entity("contacts")
export class Contact extends Audit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, type: 'varchar', length: 100 })
    @Matches(/^[a-zA-Z ]+$/, {
    message: 'fullName must only contain letters (a-z, A-Z) and spaces',
    })
    fullName: string;

    @Column({ nullable: true, type: 'varchar', length: 20 })
    phone: string | null;

    @Column({ nullable: true, type: 'varchar', length: 50 })
    email: string | null;

    @Column({ nullable: true, type: 'varchar', length: 20 })
    fax: string | null ;

    // This embeds Location's columns directly into the Contact table
    @Column(() => Location)
    location?: Location | null;

    // --- New Relationship ---
    @Column() // Explicitly define the ID column for easier querying
    userId: number;

    @ManyToOne(() => User, (user) => user.contacts, { 
        onDelete: 'CASCADE' // Automatically delete contacts if the user is deleted
    })
    @JoinColumn({ name: 'userId' }) // Links the 'userId' column to this relation
    user: User;

}