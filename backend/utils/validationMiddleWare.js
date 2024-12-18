//function to validate the schea

const backendValidation = async(schema, data) =>  { 
    try {
      await schema.validate(data); 
      return { success: true }; 

      
    }
     catch (error) {
      return { error: error.message }; 
    }
  };  
    

    module.exports={backendValidation}