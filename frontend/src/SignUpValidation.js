import * as yup from 'yup';
export const SignUpSchema = yup.object().shape({
    firstName: yup.string()
        .matches(/^[A-Za-z][^0-9]{1,10}$/, 'First name must be at most 10 alphabets')
        .required('First name is required'),
    lastName: yup.string()
        .matches(/^[A-Za-z][^0-9]{1,10}$/, 'Last name must be at most 10 alphabets')
        .required('Last name is required'),
    cnic: yup.string()
        .matches(/^\d{13}$/, 'CNIC must be exactly 13 digits')
        .required('CNIC is required'),
    phoneNumber: yup.string()
        .matches(/^\d{11}$/, 'Phone number must be exactly 11 digits')
        .required('Phone number is required'),
    email: yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    username: yup.string()
        .matches(/^(?=.*\d).{1,12}$/, 'Username must contain numbers and be no longer than 12 characters')
        .required('Username is required'),
    password: yup.string()
        .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,12}$/, 'Password must include at least one number, one special character, and be 8-12 characters long')
        .required('Password is required'),
});

