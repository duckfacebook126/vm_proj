// SignUpValidation.js

function SignUpValidation(signup_values) {
    const errors = {};

    // Check for empty values
    if (!signup_values.username) {
        errors.username = "Username is required";
    }

    if (!signup_values.password) {
        errors.password = "Password is required";
    }

    if (!signup_values.firstName) {
        errors.firstName = "First name is required";
    }

    if (!signup_values.lastName) {
        errors.lastName = "Last name is required";
    }

    if (!signup_values.cnic) {
        errors.cnic = "CNIC is required";
    }

    if (!signup_values.email) {
        errors.email = "Email is required";
    }

    if (!signup_values.phoneNumber) {
        errors.phoneNumber = "Phone number is required";
    }

    return errors;
}

export default SignUpValidation;
