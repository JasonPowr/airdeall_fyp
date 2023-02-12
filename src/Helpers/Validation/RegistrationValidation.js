import * as yup from "yup";
import "yup-phone"; //https://www.npmjs.com/package/yup-phone

const passwordRegEx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*_]{6,16}$/;
export const registrationSchema = yup.object().shape({
    firstName: yup.string().required("Required"),
    lastName: yup.string().required("Required"),
    email: yup.string().email("Please enter a valid email").required("Required"),
    password: yup.string().required("A password is required").min(6, "Password must be greater than 6 character").matches(passwordRegEx, "Password must be greater than 6 characters, Must contain a number and a special character"),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
    phoneNumber: yup.string().phone("IE",false, "Invalid Phone Number"),
})