export enum PreValidationSignupStep {
  Email = 'Email',
  Password = 'Password',
  Birthday = 'Birthday',
  CGU = 'CGU',
}

export enum PostValidationSignupStep {
  PhoneNumber = 'PhoneNumber',
}

export const SignupStep = { ...PreValidationSignupStep, ...PostValidationSignupStep }
export type SignupStep = typeof SignupStep[keyof typeof SignupStep]
