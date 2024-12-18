const Yup =require("yup");

// User login validation schema

const userLoginSchema=Yup.object(
    {
        username: Yup.string().min(1).max(12).required(),
        password: Yup.string().min(1).max(12).required(),


    }
);


//User signup Validation schema

const userSignUpSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('First name is required')
        .matches(/^[A-Za-z]{1,10}$/, 'First name must be at most 10 alphabets and no numbers'),

    lastName: Yup.string()
        .required('Last name is required')
        .matches(/^[A-Za-z]{1,10}$/, 'Last name must be at most 10 alphabets and no numbers'),

    cnic: Yup.string()
        .required('CNIC is required')
        .matches(/^\d{13}$/, 'CNIC must be exactly 13 digits')
        ,
    phoneNumber: Yup.string()
        .required('Phone number is required')
        .matches(/^\d{11}$/, 'Phone number must be exactly 11 digits'),
    email: Yup.string()
        .required('Email is required')
        .email('Invalid email format'),

    username: Yup.string()
    .required('Username is required')
    .min(6, 'Username must be at least 6 characters')
    .matches(
        /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),_.?":{}|<>])(?=.*\d).+$/,
        'Username must contain at least one alphabet, one special character, and one number'
      )         .required('Username is required')

      
      .max(12, 'username must be at most 12 characters')
      ,

    password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
        /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),_.?":{}|<>])(?=.*\d).+$/,
        'Password must contain at least one alphabet, one special character, and one number'
      )
      .max(12, 'Password must be at most 12 characters')
      
      
      
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


  const addVmValidationSchema= Yup.object().shape({

    osName:Yup.string()
    .required('OS Name is required')
    .matches(/^[a-zA-Z][a-zA-Z0-9 ]{0,19}$/,'The Os name must be between 1 to 20 characters ,should start with an alphabet and no special characters')
  ,
    vmName:Yup.string()
    .required('VM Name is required')
    .matches(/^[a-zA-Z][a-zA-Z0-9 ]{0,19}$/,'The VM name must be between 1 to 20 characters ,should start with an alphabet and no special characters')
    ,
    diskName:Yup.string()
    .required('Disk Name is required')
    .matches(/^[a-zA-Z][a-zA-Z0-9 ]{0,19}$/,'The Disk Name name must be between 1 to 20 characters ,should start with an alphabet and no special characters')
    })


  // create user validation schema on the admin page

 const addUserSchema = Yup.object().shape({
    firstName: Yup.string()
         .required('First name is required') 
         .matches(/^[A-Za-z]{1,10}$/, 'First name must be at most 10 alphabets and no numbers')
       ,
    lastName: Yup.string()
    .required('Last name is required')
        .matches(/^[A-Za-z]{1,10}$/, 'Last name must be at most 10 alphabets and no numbers')
       ,
    CNIC: Yup.string()
    .required('CNIC is required')
        .matches(/^\d{13}$/, 'CNIC must be exactly 13 digits')
        .required('CNIC is required'),

    phoneNumber: Yup.string()
    .required('Phone number is required')
        .matches(/^\d{11}$/, 'Phone number must be exactly 11 digits')
       ,
    email: Yup.string()
    .required('Email is required')
        .email('Invalid email format')
        ,
    userName: Yup.string()
    .required('Username is required')
        .matches(/^(?=.*\d).{1,12}$/, 'Username must contain numbers and be no longer than 12 characters')
      ,
    password: Yup.string()
    .required('Password is required')
        .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*_]).{8,12}$/, 'Password must include at least one number, one special character, and be 8-12 characters long')
       
});


  




/*





*/

module.exports=  {
    
userLoginSchema,
userSignUpSchema,
adminLoginSchema,
adminSignupSchema,
addVmValidationSchema,
addUserSchema




};