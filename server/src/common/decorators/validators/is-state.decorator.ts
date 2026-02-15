import { applyDecorators } from "@nestjs/common";
import { IsNotEmpty, IsString, Length, Matches } from "class-validator";
export function IsState() {
  return applyDecorators(
    IsNotEmpty({ message: 'State/Province is required' }),
    IsString(),
    // Matches 2-letter codes or full names (e.g., "NY" or "New York")
    Length(2, 50, { message: 'State/Province must be between 2 and 50 characters' }),
    Matches(/^[a-zA-Z\s]*$/, { message: 'State should only contain letters' })
  );
}
