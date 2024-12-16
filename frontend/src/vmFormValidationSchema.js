import * as Yup from 'yup'

export const vmFormValidationSchema= Yup.object().shape(
    {
        osName:Yup.string()
        .required('OS Name is required')
        .min(4,'Os name must be atleast 4 characters')
        .matches(/^[a-zA-Z][a-zA-Z0-9 ]*/,'Os namme must start with a letter, special characters are not allowed')
        .max(20,'Os Name must not exceeed the 20 chatacters')
         ,
        vmName: Yup.string()
        .required('VM Name is required')
        .min(4,'VM name must be atleast 4 characters')
        .matches(/^[a-zA-Z][a-zA-Z0-9 ]*/,'VM namme must start with a letter, special characters are not allowed')
        .max(20,'VM Name must not exceeed the 20 chatacters'),

        diskName: Yup.string()
        .required('Disk Name is required')
        .min(4,'Disk name must be atleast 4 characters')
        .matches(/^[a-zA-Z][a-zA-Z0-9 ]*/,'Disk namme must start with a letter, special characters are not allowed')
        .max(20,'Disk Name must not exceeed the 20 chatacters'), 

    }
)