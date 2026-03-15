import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserResponseDto {
  @ApiProperty({ 
    example: 'Account successfully deleted', 
    description: 'Confirmation message' 
  })
  message: string;

  @ApiProperty({ 
    example: '2024-03-15T12:00:00.000Z', 
    description: 'Timestamp of deletion' 
  })
  deletedAt: string;
}
