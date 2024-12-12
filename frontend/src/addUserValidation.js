import * as yup from 'yup';
// The current SignUpSchema already ensures that firstName and lastName do not contain any numbers by using regex patterns.
// No additional code is needed.

export const addUserSchema = yup.object().shape({
    firstName: yup.string()
        .matches(/^[A-Za-z]{1,10}$/, 'First name must be at most 10 alphabets and no numbers')
        .required('First name is required'),
    lastName: yup.string()
        .matches(/^[A-Za-z]{1,10}$/, 'Last name must be at most 10 alphabets and no numbers')
        .required('Last name is required'),
    CNIC: yup.string()
        .matches(/^\d{13}$/, 'CNIC must be exactly 13 digits')
        .required('CNIC is required'),
    phoneNumber: yup.string()
        .matches(/^\d{11}$/, 'Phone number must be exactly 11 digits')
        .required('Phone number is required'),
    email: yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    userName: yup.string()
        .matches(/^(?=.*\d).{1,12}$/, 'Username must contain numbers and be no longer than 12 characters')
        .required('Username is required'),
    password: yup.string()
        .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*_]).{8,12}$/, 'Password must include at least one number, one special character, and be 8-12 characters long')
        .required('Password is required'),
});



/**
 * @summary
 * This file exports the addUserSchema which is a Yup schema 
 * that validates the user input for the add user form.
 * 
 * @workflow
 * The addUserSchema is used in the AddUser component to 
 * validate the user input. The schema is defined using Yup's
 * object.shape() method. The schema defines the following 
 * rules for the user input:
 * 
 * - firstName: must be at most 10 alphabets and no numbers
 * - lastName: must be at most 10 alphabets and no numbers
 * - CNIC: must be exactly 13 digits
 * - phoneNumber: must be exactly 11 digits
 * - email: must be a valid email address
 * - userName: must contain numbers and be no longer than 12 characters
 * - password: must include at least one number, one special character, and be 8-12 characters long
 * 
 * The schema is then used in the AddUser component to validate
 * the user input. If the input is invalid, an error message is
 * displayed to the user.
 * 
 * 
 * @since 0.0.1
 */
