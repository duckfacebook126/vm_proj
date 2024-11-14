import * as yup from "yup";

export const LoginValidaitonSchema= yup.object().shape(
    {
        username: yup.string().matches('/^.{1,12}$/','invlaid username format').required("Username is required"),
        password: yup.string().matches('/^.{1,12}$/','invlaid pasword format').required("Password is required"),


    }
);