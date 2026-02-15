import { applyDecorators } from '@nestjs/common';
import { IsISO31661Alpha2, IsNotEmpty } from 'class-validator';

export function IsCountry() {
  return applyDecorators(
    IsNotEmpty({ message: 'Country is required' }),
    // Recommended: Use ISO codes (e.g., "US", "GB") for better DB consistency
    IsISO31661Alpha2({ message: 'Country must be a valid 2-letter ISO code' })
  );
}
    