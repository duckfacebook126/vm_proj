const Yup =require("yup");

// User login validation schema

const userLoginSchema=Yup.object().shape(
    {
        username: Yup.string().matches(/^.{1,12}$/,'username should be between 1 to 12 characters').required("Username is required"),
        password: Yup.string().matches(/^.{1,12}$/,'password should be between 1 to 12 characters').required("Password is required"),


    }
);


//User signup Validation schema

const userSignUpSchema = Yup.object().shape({
    firstName: Yup.string()
        .matches(/^[A-Za-z]{1,10}$/, 'First name must be at most 10 alphabets and no numbers')
        .required('First name is required'),
    lastName: Yup.string()
        .matches(/^[A-Za-z]{1,10}$/, 'Last name must be at most 10 alphabets and no numbers')
        .required('Last name is required'),
    cnic: Yup.string()
        .matches(/^\d{13}$/, 'CNIC must be exactly 13 digits')
        .required('CNIC is required'),
    phoneNumber: Yup.string()
        .matches(/^\d{11}$/, 'Phone number must be exactly 11 digits')
        .required('Phone number is required'),
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    username: Yup.string()
    .min(6, 'Username must be at least 6 characters')
    .matches(
        /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),_.?":{}|<>])(?=.*\d).+$/,
        'Username must contain at least one alphabet, one special character, and one number'
      )         .required('Username is required')

      
      .max(12, 'username must be at most 12 characters')
      .required('Username is required'),

    password: Yup.string()

    .min(6, 'Password must be at most 12 characters')
      
    .matches(
        /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),_.?":{}|<>])(?=.*\d).+$/,
        'Password must contain at least one alphabet, one special character, and one number'
      )
      .max(12, 'Password must be at most 12 characters')
      
      .required('Password is required').min(6, 'Password must be at least 6 characters')
      
});


//admin login validation Schema

const adminLoginSchema = Yup.object().shape({
    username: Yup.string()
      .required('Username is required'),
    password: Yup.string()
      .required('Password is required')
  });

  //adminSignUp Schema

  const adminSignupSchema = Yup.object().shape({
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



  //add vm form validation Schema


  const validationSchema= Yup.object().shape({

    osName:Yup.string()
    .matches(/^[a-zA-Z][a-zA-Z0-9 ]{0,19}$/,'The Os name must be between 1 to 20 characters ,should start with an alphabet and no special characters')
    .required('OS Name is required'),
    vmName:Yup.string()
    .matches(/^[a-zA-Z][a-zA-Z0-9 ]{0,19}$/,'The VM name must be between 1 to 20 characters ,should start with an alphabet and no special characters')
    .required('VM Name is required'),
    diskName:Yup.string()
    .matches(/^[a-zA-Z][a-zA-Z0-9 ]{0,19}$/,'The Disk Name name must be between 1 to 20 characters ,should start with an alphabet and no special characters')
    .required('Disk Name is required')
    })


  // create user validation schema on the admin page

 const addUserSchema = Yup.object().shape({
    firstName: Yup.string()
        .matches(/^[A-Za-z]{1,10}$/, 'First name must be at most 10 alphabets and no numbers')
        .required('First name is required'),
    lastName: Yup.string()
        .matches(/^[A-Za-z]{1,10}$/, 'Last name must be at most 10 alphabets and no numbers')
        .required('Last name is required'),
    CNIC: Yup.string()
        .matches(/^\d{13}$/, 'CNIC must be exactly 13 digits')
        .required('CNIC is required'),
    phoneNumber: Yup.string()
        .matches(/^\d{11}$/, 'Phone number must be exactly 11 digits')
        .required('Phone number is required'),
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    userName: Yup.string()
        .matches(/^(?=.*\d).{1,12}$/, 'Username must contain numbers and be no longer than 12 characters')
        .required('Username is required'),
    password: Yup.string()
        .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*_]).{8,12}$/, 'Password must include at least one number, one special character, and be 8-12 characters long')
        .required('Password is required'),
});


  




/*





*/

module.exports=  {
    
userLoginSchema,
userSignUpSchema,
adminLoginSchema,
adminSignupSchema,
validationSchema,
addUserSchema




};