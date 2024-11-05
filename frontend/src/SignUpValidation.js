// SignUpValidation.js


// Regular expression patterns for each field
const username_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,10}$/;
const password_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
const first_name_pattern = /^[a-zA-Z]{1,10}$/;
const last_name_pattern = /^[a-zA-Z]{1,10}$/;
const cnic_pattern = /^[\d]{13}$/;
const email_pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phone_number_pattern = /^\d{11}$/;

function SignUpValidation(signup_values) {
    const errors = {};

    // Username validation
    if (!signup_values.username) {
        errors.username = "Username is required";
    } else if (!username_pattern.test(signup_values.username)) {
        errors.username = "Username must be 6-10 characters long, with at least one lowercase, one uppercase, and one number";
    }

    // Password validation
    if (!signup_values.password) {
        errors.password = "Password is required";
    } else if (!password_pattern.test(signup_values.password)) {
        errors.password = "Password must be 8-15 characters long, with at least one lowercase, one uppercase, one number, and one special character";
    }

    // First name validation
    if (!signup_values.firstName) {
        errors.firstName = "First name is required";
    } else if (!first_name_pattern.test(signup_values.firstName)) {
        errors.firstName = "First name must be 1-10 alphabetic characters";
    }

    // Last name validation
    if (!signup_values.lastName) {
        errors.lastName = "Last name is required";
    } else if (!last_name_pattern.test(signup_values.lastName)) {
        errors.lastName = "Last name must be 1-10 alphabetic characters";
    }

    // CNIC validation
    if (!signup_values.cnic) {
        errors.CNIC = "CNIC is required";
    } else if (!cnic_pattern.test(signup_values.cnic)) {
        errors.CNIC = "CNIC must be exactly 13 numeric characters";
    }

    // Email validation
    if (!signup_values.email) {
        errors.email = "Email is required";
    } else if (!email_pattern.test(signup_values.email)) {
        errors.email = "Invalid email format";
    }

    // Phone number validation
    if (!signup_values.phoneNumber) {
        errors.phoneNumber = "Phone number is required";
    } else if (!phone_number_pattern.test(signup_values.phoneNumber)) {
        errors.phoneNumber = "Phone number must be exactly 11 numeric characters";
    }

    return errors;
}

export default SignUpValidation;
