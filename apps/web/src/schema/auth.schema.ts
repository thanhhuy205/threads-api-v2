import z from "zod";

export const AuthErrorMessage = {
  USERNAME_INVALID: "auth.error.usernameInvalid",
  USERNAME_RULE: "auth.error.usernameRule",
  USERNAME_EXISTS: "auth.error.usernameExists",
  EMAIL_INVALID: "auth.error.emailInvalid",
  EMAIL_EXISTS: "auth.error.emailExists",
  PASSWORD_INVALID: "auth.error.passwordInvalid",
  PASSWORD_MIN: "auth.error.passwordMin",
  PASSWORD_CONFIRM_NOT_MATCH: "auth.error.passwordConfirmNotMatch",
};

const usernameRegex = /^[a-zA-Z0-9_-]+$/;

const LoginSchemaBody = z.object({
  login: z
    .string({ message: AuthErrorMessage.USERNAME_INVALID })
    .min(6, { message: AuthErrorMessage.USERNAME_INVALID }),
  password: z
    .string({ message: AuthErrorMessage.PASSWORD_INVALID })
    .min(8, { message: AuthErrorMessage.PASSWORD_MIN }),
});

const RegisterSchemaBody = z
  .object({
    username: z
      .string({ message: AuthErrorMessage.USERNAME_INVALID })
      .min(6, { message: AuthErrorMessage.USERNAME_INVALID })
      .regex(usernameRegex, { message: AuthErrorMessage.USERNAME_RULE }),

    email: z
      .string({ message: AuthErrorMessage.EMAIL_INVALID })
      .email({ message: AuthErrorMessage.EMAIL_INVALID }),

    password: z
      .string({ message: AuthErrorMessage.PASSWORD_INVALID })
      .min(8, { message: AuthErrorMessage.PASSWORD_MIN }),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: AuthErrorMessage.PASSWORD_CONFIRM_NOT_MATCH,
    path: ["confirmPassword"],
  });

const ForgotPasswordSchemaBody = z.object({
  email: z
    .string({ message: AuthErrorMessage.EMAIL_INVALID })
    .email({ message: AuthErrorMessage.EMAIL_INVALID }),
});

const ResetPasswordSchemaBody = z
  .object({
    token: z.string().min(1),
    email: z.string().email({ message: AuthErrorMessage.EMAIL_INVALID }),
    password: z
      .string({ message: AuthErrorMessage.PASSWORD_INVALID })
      .min(8, { message: AuthErrorMessage.PASSWORD_MIN }),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: AuthErrorMessage.PASSWORD_CONFIRM_NOT_MATCH,
        path: ["password_confirmation"],
      });
    }
  });

export {
  ForgotPasswordSchemaBody,
  LoginSchemaBody,
  RegisterSchemaBody,
  ResetPasswordSchemaBody,
};

export type LoginSchemaBodyType = z.infer<typeof LoginSchemaBody>;
export type RegisterSchemaBodyType = z.infer<typeof RegisterSchemaBody>;
export type ForgotPasswordSchemaBodyType = z.infer<
  typeof ForgotPasswordSchemaBody
>;
export type ResetPasswordSchemaBodyType = z.infer<
  typeof ResetPasswordSchemaBody
>;
