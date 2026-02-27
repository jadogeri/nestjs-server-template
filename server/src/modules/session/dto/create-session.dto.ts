import { IsSecuredToken } from "../../../common/decorators/validators/is-secured-token.decorator";
import { Auth } from "../../../modules/auth/entities/auth.entity";
import { ApiProperty } from "@nestjs/swagger/dist/decorators/api-property.decorator";

export class CreateSessionDto {

    id: string;
    @ApiProperty({
        description: 'The unique identifier for the session',
        example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
        required: true,
    })
    @IsSecuredToken()
    refreshTokenHash: string;
    @ApiProperty({
        description: 'The date and time when the session expires',
        example: '2024-12-31T23:59:59.000Z',
        required: false,
    })
    expiresAt?: Date;
 
    auth: Auth
}
    