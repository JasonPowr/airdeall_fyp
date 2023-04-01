import * as yup from "yup";
import "yup-phone"; //https://www.npmjs.com/package/yup-phone

export const phoneConfirmValidationSchema = yup.object().shape({
    phoneNumber: yup.string().phone("IE", false, "Invalid Phone Number"),
    code: yup.number().max(6)
})