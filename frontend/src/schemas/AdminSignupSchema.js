import * as Yup from 'yup';

export const AdminSignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .matches(/^[a-zA-Z]+$/, 'First name must contain only alphabetic characters')
    .max(15, 'First name must be at most 15 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .matches(/^[a-zA-Z]+$/, 'First name must contain only alphabetic characters')

    .max(15, 'Last name must be at most 15 characters')
    .required('Last name is required'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{11}$/, 'Phone number must contain exactly 11 digits')
    .required('Phone number is required'),
  cnic: Yup.string()
    .matches(/^[0-9]{13}$/, 'CNIC must contain exactly 13 digits')
    .required('CNIC is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  username: Yup.string()
    .min(4, 'Username must be at least 4 characters')
    .matches(
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),_.?":{}|<>])(?=.*\d).+$/,
      'Username must contain at least one alphabet, one special character, and one number'
    ) 
    .max(12, 'Username must be at most 12 characters')
    .required('Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?_":{}|<>])(?=.*\d).+$/,
      'Password must contain at least one alphabet, one special character, and one number'
    )
    .max(12, 'Password must be at most 12 characters')
    .required('Password is required')
});
