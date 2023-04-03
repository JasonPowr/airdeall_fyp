import * as yup from "yup";

export const createAlertValidationSchema = yup.object().shape({
    title: yup.string().required("Required"),
    description: yup.string().required("Required"),
    voiceActivationPhrase: yup.string().required("Required"),
})

