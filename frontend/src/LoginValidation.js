import * as yup from "yup";

export const LoginValidaitonSchema= yup.object().shape(
    {
        username: yup.string().matches(/^.{1,12}$/,'username should be between 1 to 12 characters').required("Username is required"),
        password: yup.string().matches(/^.{1,12}$/,'password should be between 1 to 12 characters').required("Password is required"),


    }
);

/**
 * @file LoginValidation.js
 * @summary This file exports the LoginValidaitonSchema which is a Yup schema 
 * that validates the user input for the login form.
 * 
 * @workflow
 * The LoginValidaitonSchema is used in the Login component to 
 * validate the user input. The schema is defined using Yup's
 * object.shape() method. The schema defines the following 
 * rules for the user input:
 * 
 * - username: must be between 1 to 12 characters
 * - password: must be between 1 to 12 characters
 * 
 * The schema is then used in the Login component to validate
 * the user input. If the input is invalid, an error message is
 * displayed to the user.
 * 
 * 
 * 
 */
