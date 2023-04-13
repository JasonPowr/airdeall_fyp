import * as yup from "yup";
import "yup-phone"; //https://www.npmjs.com/package/yup-phone

export const safePointRegistrationSchema = yup.object().shape({
    businessName: yup.string().required("Required"),
    emailAddress: yup.string().email("Please enter a valid email").required("Required"),
    address: yup.string().required("Required"),
    phoneNumber: yup.string().phone("IE", false, "Invalid Phone Number"),
    reasonForApplying: yup.string().required("Required"),
    checkInPhrase: yup.string().required("Required"),
    applicantFullName: yup.string().required("Required"),
    applicantJobTitle: yup.string().required("Required"),
    applicantPhoneNumber: yup.string().phone("IE", false, "Invalid Phone Number"),
    applicantEmailAddress: yup.string().email("Please enter a valid email").required("Required"),
})