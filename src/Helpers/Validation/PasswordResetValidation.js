import * as yup from "yup";

//const passwordRules = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

export const passwordResetValidationSchema = yup.object().shape({
    email: yup.string().email("Please enter a valid email").required("Required"),
})