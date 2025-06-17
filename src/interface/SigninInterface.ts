export interface Signin{
    email:string;
    password:string;
}

export const signinValidation=(data:Signin)=>{
    if(!data.email && !data.password){
        return "All fields are required"
    }
    if (!data.email || !data.password) {
    return 'All fields are required';
  }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(data.email.trim())) {
        return 'Invalid email format';
    }

    if (data.password.length < 6) {
        return 'Password must be at least 6 characters';
    }

    const hasUpper   = /[A-Z]/.test(data.password);
    const hasLower   = /[a-z]/.test(data.password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(data.password);

    if (!hasUpper)   return 'Password needs at least one uppercase letter';
    if (!hasLower)   return 'Password needs at least one lowercase letter';
    if (!hasSpecial) return 'Password needs at least one special character';

    return null;
}