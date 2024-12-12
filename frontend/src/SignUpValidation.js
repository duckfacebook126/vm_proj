import * as yup from 'yup';
// The current SignUpSchema already ensures that firstName and lastName do not contain any numbers by using regex patterns.


export const SignUpSchema = yup.object().shape({
    firstName: yup.string()
        .matches(/^[A-Za-z]{1,10}$/, 'First name must be at most 10 alphabets and no numbers')
        .required('First name is required'),
    lastName: yup.string()
        .matches(/^[A-Za-z]{1,10}$/, 'Last name must be at most 10 alphabets and no numbers')
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
    .min(6, 'Username must be at least 6 characters')
    .matches(
        /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),_.?":{}|<>])(?=.*\d).+$/,
        'Username must contain at least one alphabet, one special character, and one number'
      )         .required('Username is required')

      
      .max(12, 'username must be at most 12 characters')
      .required('Username is required'),

    password: yup.string()

    .min(6, 'Password must be at most 12 characters')
      
    .matches(
        /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),_.?":{}|<>])(?=.*\d).+$/,
        'Password must contain at least one alphabet, one special character, and one number'
      )
      .max(12, 'Password must be at most 12 characters')
      
      .required('Password is required').min(6, 'Password must be at least 6 characters')
      
});



/**
 * @summary
 * This file exports the SignUpSchema which is a Yup schema 
 * that validates the user input for the sign up form.
 * 
 * @workflow
 * The SignUpSchema is used in the SignUp component to 
 * validate the user input. The schema is defined using Yup's
 * object.shape() method. The schema defines the following 
 * rules for the user input:
 * 
 * - firstName: must be at most 10 alphabets and no numbers
 * - lastName: must be at most 10 alphabets and no numbers
 * - cnic: must be exactly 13 digits
 * - phoneNumber: must be exactly 11 digits
 * - email: must be a valid email address
 * - username: must be at least 6 characters long and contain
 *   at least one alphabet, one special character, and one number
 * - password: must be at least 6 characters long and contain
 *   at least one alphabet, one special character, and one number
 * 
 * The schema is then used in the SignUp component to validate
 * the user input. If the input is invalid, an error message is
 * displayed to the user.
 * 
 * 
 * @since 0.0.1
 */

