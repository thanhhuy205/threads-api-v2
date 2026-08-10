import {
  type ValidationArguments,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
  registerDecorator,
  type ValidationOptions,
} from 'class-validator';
import { AuthErrorMessage } from './auth-error-message';

const usernameRegex = /^[a-zA-Z0-9._-]{3,32}$/;

@ValidatorConstraint({ name: 'isEmailOrUsername', async: false })
export class IsEmailOrUsernameConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== 'string') return false;
    return value.includes('@')
      ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      : usernameRegex.test(value);
  }

  defaultMessage(): string {
    return 'Login must be a valid email or username';
  }
}

export const IsEmailOrUsername = (validationOptions?: ValidationOptions) =>
  (object: object, propertyName: string) =>
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsEmailOrUsernameConstraint,
    });

@ValidatorConstraint({ name: 'matchesPassword', async: false })
export class MatchesPasswordConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    return value === (args.object as { password?: unknown }).password;
  }

  defaultMessage(): string {
    return AuthErrorMessage.PASSWORD_CONFIRM_NOT_MATCH;
  }
}

export const MatchesPassword = (validationOptions?: ValidationOptions) =>
  (object: object, propertyName: string) =>
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: MatchesPasswordConstraint,
    });
