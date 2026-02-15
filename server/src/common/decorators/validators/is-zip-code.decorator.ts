import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, isPostalCode, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
    

export function IsZipCode() {
  return applyDecorators(
    IsNotEmpty({ message: 'Zip/Postal code is required' }),
    // Link to our dynamic constraint
    Validate(IsPostalCodeByCountryConstraint)
  );
}
    
@ValidatorConstraint({ name: 'isPostalCodeByCountry', async: false })
class IsPostalCodeByCountryConstraint implements ValidatorConstraintInterface {
  // "value" is the postal code, "args.object" is the entire DTO
  validate(value: string, args: ValidationArguments) {
    const object = args.object as any;
    const countryCode = object.country; // This must match your DTO property name

    // If no country is provided, we can't validate specific format, 
    // so we fall back to 'any' or return false.
    if (!countryCode) return isPostalCode(value, 'any');

    try {
      return isPostalCode(value, countryCode);
    } catch {
      // If countryCode is invalid or unsupported, fallback to generic check
      return isPostalCode(value, 'any');
    }
  }

  defaultMessage(args: ValidationArguments) {
    const object = args.object as any;
    return `Postal code '${args.value}' is not valid for country ${object.country || 'selected'}`;
  }
}
