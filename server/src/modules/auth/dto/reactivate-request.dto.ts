
import { PickType } from '@nestjs/swagger';
import { DeactivateDto } from './deactivate.dto';

export class ReactivateRequestDto extends PickType(DeactivateDto, ['email']) { }