

function LoginValidation(login_values) {

  const username_pattern=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,10}$/
  const password_pattern=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/
  let error={};

if(login_values.username==="")
{
  error.username="Username is required";
}
else if(!username_pattern.test(login_values.username)){
  error.username="Username does not match "
}
else{error.email=""}

if(login_values.password==="")
{
error.password="Password is required";
}


else if(!password_pattern.test(login_values.password)){

  error.password="Password oes not match";
}

  return error;
}

export default LoginValidation
