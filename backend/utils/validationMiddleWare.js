//function to validate the schea

const userLoginValidation=(schema,data)=> async(req,res)=>
    {

        
        try{
            await schema.validate(data)

        }
        

        catch(error)
        {
            return res.status(400).json({error})

        }

        
    }

    module.exports={userLoginValidation}