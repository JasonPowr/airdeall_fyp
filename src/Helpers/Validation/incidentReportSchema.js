import * as yup from "yup";

export const incidentReportSchema = yup.object().shape({
    incidentReport: yup.string().required("Required")
})

