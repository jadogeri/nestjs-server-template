import { Column, BaseEntity } from 'typeorm';
import { IsAddress } from '../decorators/validators/is-address.decorator';
import { IsCity } from '../decorators/validators/is-city.decorator';
import { IsState } from '../decorators/validators/is-state.decorator';
import { IsCountry } from '../decorators/validators/is-country.decorator';
import { IsZipCode } from '../decorators/validators/is-zip-code.decorator';


export abstract class Location extends BaseEntity{
    @Column({ nullable: true })
    @IsAddress()
    address: string;

    @Column({ nullable: true })
    @IsCity()
    city: string;

    @Column({ nullable: true })
    @IsState()
    state: string;
    
    @Column({ nullable: true })
    @IsZipCode()
    zipcode: string;

    @Column({ nullable: true })
    @IsCountry()
    country: string;
}
