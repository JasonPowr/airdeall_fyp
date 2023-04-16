import {Button, makeStyles, TextField} from "@material-ui/core";
import {useFormik} from "formik";
import {safePointRegistrationSchema} from "../../../Helpers/Validation/SafepointRegistrationFormValidation";
import React, {useState} from 'react';
import FileUploadCard from "../../Cards/FIleUploadCard/fileUploadCard";
import {v4 as uuidv4} from "uuid";
import {submitSafepointApplication, uploadProofOfSafePoint} from "../../../model/db/DB";
import {Link} from "react-router-dom";

const useStyles = makeStyles({
    container: {
        textAlign: 'center',
        display: 'block',
        fontFamily: "Raleway",
        height: '100%',
        overflow: 'auto',
    },
    link: {
        textDecoration: 'none',
        color: 'white'
    },
})

export default function SafePointRegistrationForm({setIsSubmitted}) {
    const [file, setFile] = useState(null);
    const [fileError, setFileError] = useState("You have to provide proof");
    const classes = useStyles();

    const onSubmit = async () => {
        if (file === null) {
            console.log(fileError)
        } else {
            const safepointApplication = {
                applicationId: uuidv4(),
                businessName: values.businessName,
                businessEmail: values.businessEmail,
                businessAddress: values.businessAddress,
                businessPhoneNumber: values.businessPhoneNumber,
                reasonForApplying: values.reasonForApplying,
                checkInPhrase: values.checkInPhrase,
                applicantFullName: values.applicantFullName,
                applicantJobTitle: values.applicantJobTitle,
                applicantPhoneNumber: values.applicantPhoneNumber,
                applicantEmailAddress: values.applicantEmailAddress,
            }
            try {
                await uploadProofOfSafePoint(file, safepointApplication.applicationId)
                await submitSafepointApplication(safepointApplication)
            } catch (e) {
                console.log(e)
            }
            setIsSubmitted(true)
        }
    }

    const {handleSubmit, values, handleChange, handleBlur, errors, touched} = useFormik({
        initialValues: {
            businessName: "",
            businessEmail: "",
            businessAddress: "",
            businessPhoneNumber: "",
            proofOfBusiness: null,
            reasonForApplying: "",
            checkInPhrase: "",
            applicantFullName: "",
            applicantJobTitle: "",
            applicantPhoneNumber: "",
            applicantEmailAddress: "",
        },
        validationSchema: safePointRegistrationSchema,
        onSubmit,
    })

    return (
        <form onSubmit={handleSubmit} autoComplete={"off"} className={classes.container}>

            <h4> Please fill out the form below....</h4>


            <TextField
                error={!!(errors.businessName && touched.businessName)}
                label={errors.businessName && touched.businessName ? "Invalid Name" : "Registered Business Name"}
                helperText={errors.businessName && touched.businessName ? errors.businessName : " "}
                value={values.businessName}
                variant="filled"
                onChange={handleChange}
                onBlur={handleBlur}
                className={"textField"}
                id={"businessName"}
                placeholder={"Registered Business Name"}
                InputProps={{
                    disableUnderline: true,
                    inputProps: {style: {backgroundColor: 'white', borderRadius: '10px'}}
                }}/>

            <TextField
                error={!!(errors.businessAddress && touched.businessAddress)}
                label={errors.businessAddress && touched.businessAddress ? "Invalid Address" : "Business Address"}
                helperText={errors.businessAddress && touched.businessAddress ? errors.businessAddress : " "}
                value={values.businessAddress}
                variant="filled"
                onChange={handleChange}
                onBlur={handleBlur}
                className={"textField"}
                id={"businessAddress"}
                placeholder={"Business Address"}
                InputProps={{
                    disableUnderline: true,
                    inputProps: {style: {backgroundColor: 'white', borderRadius: '10px'}}
                }}/>

            <TextField
                error={!!(errors.businessEmail && touched.businessEmail)}
                label={errors.businessEmail && touched.businessEmail ? "Invalid Email" : "Business Email"}
                helperText={errors.businessEmail && touched.businessEmail ? errors.businessEmail : " "}
                value={values.businessEmail}
                variant="filled"
                onChange={handleChange}
                onBlur={handleBlur}
                className={"textField"}
                id={"businessEmail"}
                placeholder={"Business Email"}
                InputProps={{
                    disableUnderline: true,
                    inputProps: {style: {backgroundColor: 'white', borderRadius: '10px'}}
                }}/>

            <TextField
                error={!!(errors.businessPhoneNumber && touched.businessPhoneNumber)}
                label={errors.businessPhoneNumber && touched.businessPhoneNumber ? "Invalid Phone Number" : "Business Phone Number"}
                helperText={errors.businessPhoneNumber && touched.businessPhoneNumber ? errors.businessPhoneNumber : " "}
                value={values.businessPhoneNumber}
                variant="filled"
                onChange={handleChange}
                onBlur={handleBlur}
                className={"textField"}
                id={"businessPhoneNumber"}
                placeholder={"Business Phone Number"}
                InputProps={{
                    disableUnderline: true,
                    inputProps: {style: {backgroundColor: 'white', borderRadius: '10px'}}
                }}/>

            <TextField
                error={!!(errors.checkInPhrase && touched.checkInPhrase)}
                label={errors.checkInPhrase && touched.checkInPhrase ? "Invalid Phrase" : "Safe Point Password Phrase"}
                helperText={errors.checkInPhrase && touched.checkInPhrase ? errors.checkInPhrase : " "}
                value={values.checkInPhrase}
                variant={"filled"}
                onChange={handleChange}
                onBlur={handleBlur}
                className={"textField"}
                id={"checkInPhrase"}
                placeholder={"Please Enter a phrase you would set if a person was to try and check in at your safepoint"}
                InputProps={{
                    disableUnderline: true,
                    inputProps: {style: {backgroundColor: 'white', borderRadius: '10px'}}
                }}/>

            <TextField
                error={!!(errors.applicantFullName && touched.applicantFullName)}
                label={errors.applicantFullName && touched.applicantFullName ? "Invalid Phrase" : "Please enter your name"}
                helperText={errors.applicantFullName && touched.applicantFullName ? errors.applicantFullName : " "}
                value={values.applicantFullName}
                variant="filled"
                onChange={handleChange}
                onBlur={handleBlur}
                className={"textField"}
                id={"applicantFullName"}
                placeholder={"Please enter your name"}
                InputProps={{
                    disableUnderline: true,
                    inputProps: {style: {backgroundColor: 'white', borderRadius: '10px'}}
                }}/>

            <TextField
                error={!!(errors.applicantJobTitle && touched.applicantJobTitle)}
                label={errors.applicantJobTitle && touched.applicantJobTitle ? "Invalid Job title" : "Please enter your Job title"}
                helperText={errors.applicantJobTitle && touched.applicantJobTitle ? errors.applicantJobTitle : " "}
                value={values.applicantJobTitle}
                variant="filled"
                onChange={handleChange}
                onBlur={handleBlur}
                className={"textField"}
                id={"applicantJobTitle"}
                placeholder={"Please enter your Job title"}
                InputProps={{
                    disableUnderline: true,
                    inputProps: {style: {backgroundColor: 'white', borderRadius: '10px'}}
                }}/>

            <TextField
                error={!!(errors.applicantPhoneNumber && touched.applicantPhoneNumber)}
                label={errors.applicantPhoneNumber && touched.applicantPhoneNumber ? "Invalid Phone Number" : "Please enter your Phone Number"}
                helperText={errors.applicantPhoneNumber && touched.applicantPhoneNumber ? errors.applicantPhoneNumber : " "}
                value={values.applicantPhoneNumber}
                variant="filled"
                onChange={handleChange}
                onBlur={handleBlur}
                className={"textField"}
                id={"applicantPhoneNumber"}
                placeholder={"Please enter your Phone Number"}
                InputProps={{
                    disableUnderline: true,
                    inputProps: {style: {backgroundColor: 'white', borderRadius: '10px'}}
                }}/>

            <TextField
                error={!!(errors.applicantEmailAddress && touched.applicantEmailAddress)}
                label={errors.applicantEmailAddress && touched.applicantEmailAddress ? "Invalid Email Address" : "Please enter your Email Address"}
                helperText={errors.applicantEmailAddress && touched.applicantEmailAddress ? errors.applicantEmailAddress : " "}
                value={values.applicantEmailAddress}
                variant="filled"
                onChange={handleChange}
                onBlur={handleBlur}
                className={"textField"}
                id={"applicantEmailAddress"}
                placeholder={"Please enter your Email Address"}
                InputProps={{
                    disableUnderline: true,
                    inputProps: {style: {backgroundColor: 'white', borderRadius: '10px'}}
                }}/>

            <TextField
                error={!!(errors.reasonForApplying && touched.reasonForApplying)}
                label={errors.reasonForApplying && touched.reasonForApplying ? "Invalid Reason" : "Please enter you reason for applying"}
                helperText={errors.reasonForApplying && touched.reasonForApplying ? errors.reasonForApplying : " "}
                value={values.reasonForApplying}
                multiline={true}
                minRows={8}
                onChange={handleChange}
                onBlur={handleBlur}
                className={"textField"}
                id={"reasonForApplying"}
                placeholder={"Please enter you reason for applying"}
                InputProps={{
                    disableUnderline: true,
                    inputProps: {style: {backgroundColor: 'white', borderRadius: '10px'}}
                }}/>

            <FileUploadCard setFile={setFile}/>
            <Button type={"submit"} variant={"contained"} size={"large"}><b>Apply</b></Button>
            <Link to={"/"} className={classes.link}><p>Cancel</p></Link>
        </form>
    );
}

//https://codefrontend.com/file-upload-reactjs/#:~:text=In%20React%20file%20upload%20is,data%20to%20accept%20file%20uploads.