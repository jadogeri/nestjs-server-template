import { applyDecorators } from "@nestjs/common";
import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export function IsCity() {
  return applyDecorators(
    IsNotEmpty({ message: 'City is required' }),
    IsString(),
    Length(2, 50, { message: 'City must be between 2 and 50 characters' }),
    Matches(/^[a-zA-Z\s\\-]*$/, { message: 'City should only contain letters' })
  );
}
