import { applyDecorators } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, Length, Matches } from "class-validator";

type NameType = "FirstName" | "LastName";

export function IsName(label: NameType = 'FirstName') {
  return applyDecorators(
    IsString(),
    IsNotEmpty({ message: `${label} cannot be empty` }),
    Length(2, 50, { message: `${label} must be between 2 and 50 characters` }),
    Transform(({ value }) => typeof value === 'string' ? value.trim() : value),
    Matches(/^[a-zA-Z-]+$/, { 
      message: `${label} must contain only letters and hyphens` 
    })
  );
}

