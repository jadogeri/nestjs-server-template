import { ApiProperty } from '@nestjs/swagger';
import { IsUserEmail } from '../../../common/decorators/validators/is-email.decorator'; 
import { IsBoolean, Equals } from 'class-validator';

export class DeactivateDto {


  @ApiProperty({ example: 'john.doe@example.com', description: 'The email address of the user', required: true })
  @IsUserEmail()
  email: string;

  @ApiProperty({ example: true, description: 'confirmation of request', required: true })
  @IsBoolean()
  @Equals(true)
  confirm: boolean;

}
