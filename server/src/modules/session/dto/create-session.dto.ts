import { Type } from "class-transformer";
import { IsSecuredToken } from "../../../common/decorators/validators/is-secured-token.decorator";
import { Auth } from "../../../modules/auth/entities/auth.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsUUID } from "class-validator";

export class CreateSessionDto {

    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @IsUUID()
    @IsNotEmpty() 
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
    @IsDate()
    @Type(() => Date)
    expiresAt?: Date;
 
    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    authId: number;
    auth: Auth
}
    