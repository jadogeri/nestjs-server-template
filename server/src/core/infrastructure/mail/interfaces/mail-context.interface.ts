export interface BaseEmailContext {
  company?: string;
  year?: number;
  logoUrl?: string;
  firstName?: string;
}

export interface WelcomeEmailContext extends BaseEmailContext {
  email: string;
}

export interface VerificationEmailContext extends BaseEmailContext {
  verificationLink: string;

}

export interface AccountLockedEmailContext extends BaseEmailContext {
  email: string;
}

// A union type for your reusable sendEmail method
export type MailContext = WelcomeEmailContext | VerificationEmailContext ;
