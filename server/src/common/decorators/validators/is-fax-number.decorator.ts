// fax-number.decorator.ts
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isFaxNumber', async: false })
export class IsFaxNumberConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!value) return false;
    // Regex for basic 10-digit, dashes, or international format: +(country)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const cleaned = value.replace(/[\s\(\)\-\.]/g, ''); // Remove spaces/parentheses
    return phoneRegex.test(cleaned);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid fax number format';
  }
}

export function IsFaxNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsFaxNumberConstraint,
    });
  };
}
