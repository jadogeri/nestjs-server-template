// is-phone-number.decorator.ts
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isPhoneNumber', async: false })
export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (!value || typeof value !== 'string') return false;

    /**
     * Regex Breakdown:
     * ^(\+?\d{1,3})?          - Optional leading '+' and 1-3 digit country code
     * [-. (]*                 - Optional separators (dot, dash, space, open paren)
     * (\d{3})                 - 3 digits (Area code)
     * [-. )]*                 - Optional separators (dot, dash, space, close paren)
     * (\d{3})                 - 3 digits (Exchange)
     * [-. ]*                  - Optional separators (dot, dash, space)
     * (\d{4})$                - 4 digits (Line number)
     */
    const phoneRegex = /^(\+?\d{1,3})?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})$/;
    
    return phoneRegex.test(value.trim());
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid phone number (e.g., +12133734253, (213) 373-4253, or 213.373.4253)`;
  }
}

export function IsPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPhoneNumberConstraint,
    });
  };
}
