export interface SignupInterface {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  confirmPassword: string;
}

export const validateSignup = (data: SignupInterface) => {

  if (!data.name && !data.email && !data.password && !data.confirmPassword && !data.phoneNumber) {
    return 'All fields are required'
  }

  for (const [key, value] of Object.entries(data)) {
    if (!value.trim()) return `${key} is required`;
  }

  if (!/^[A-Za-z\s]{2,}$/.test(data.name))
    return 'Name must contain only letters and spaces (min 2 characters)';

  if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(data.email))
    return 'Invalid email address';

  if (!data.phoneNumber.trim())
    return 'Phone Number is required';

  if (data.password.length < 6)
    return 'Password must be at least 6 characters';
  if (!/[A-Z]/.test(data.password))
    return 'Password must include an uppercase letter';
  if (!/[a-z]/.test(data.password))
    return 'Password must include a lowercase letter';
  if (!/[0-9]/.test(data.password))
    return 'Password must include a number';
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(data.password))
    return 'Password must include a special character';

  if (data.password !== data.confirmPassword)
    return 'Passwords do not match';

  if (!/^\d{10}$/.test(data.phoneNumber))
    return 'Phone number must be 10 digits';

  return null;
};