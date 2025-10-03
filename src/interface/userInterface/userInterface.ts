export interface User {
  id: string;
  name: string;
  email: string;
  forgotPassword?: boolean;
  googleId?: string;
}
