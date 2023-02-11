import {Button, TextField} from "@material-ui/core";
import {Link, useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import {createAlertValidationSchema} from "../../../Helpers/Validation/CreateAlertValidation";
import {auth, db} from "../../../firebase";
import {doc, setDoc, collection, addDoc} from "firebase/firestore";
import {Switch} from "@mui/material";
import {useState} from "react";

export default function CreateAlertPage() {
    const navigate = useNavigate()

    const onSubmit = async () => {

        const alert = {
            title: values.title,
            desc: values.alertDesc,
            sms: values.smsMessage,
            alarm: values.alarm,
            flashlight: values.flashlight,
        }

        const alertRef = doc(db, "users", `${auth.currentUser.uid}`, "alerts", `${alert.title}`);
        await setDoc(alertRef, {alert}, {merge: true});

        navigate('/alerts')
    }

    const { handleSubmit, values, handleChange, handleBlur, errors, touched } = useFormik({
        initialValues: {
            title: "",
            alertDesc: "",
            smsMessage: false,
            alarm: false,
            flashlight: false,
        },
        validationSchema: createAlertValidationSchema,
        onSubmit,
    })

    return(
        <div>
            <div>
                <p>Create Alert</p>
            </div>

            <form onSubmit={handleSubmit} autoComplete={"off"}>

                <div>
                    <TextField
                        error={!!(errors.title && touched.title)}
                        label={errors.title && touched.title ? "Invalid Name" : "Alert Name"}
                        helperText={errors.title && touched.title ? errors.title : " "}
                        value={values.title}
                        variant="filled"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={"textField"}
                        id={"title"}
                        placeholder={"Alert Title"}
                        InputProps={{disableUnderline: true, inputProps: { style: {backgroundColor: 'white', borderRadius: '10px' }}}} />
                </div>

                <div>
                    <TextField
                        error={!!(errors.alertDesc && touched.alertDesc)}
                        label={errors.alertDesc && touched.alertDesc ? "Invalid Desc" : "Alert Desc"}
                        helperText={errors.alertDesc && touched.alertDesc ? errors.alertDesc : " "}
                        value={values.alertDesc}
                        variant="filled"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={"textField"}
                        id={"alertDesc"}
                        placeholder={"Alert Description"}
                        InputProps={{disableUnderline: true, inputProps: { style: {backgroundColor: 'white', borderRadius: '10px' }}}} />
                </div>

                <div>
                    <p>SMS message</p>

                    <Switch
                        onChange={handleChange}
                        id={"smsMessage"}
                        />
                </div>

                <div>
                    <p>Sound Alarm</p>

                    <Switch
                        onChange={handleChange}
                        id={"alarm"}
                    />
                </div>

                <div>
                    <p>Trigger Flashlight</p>

                    <Switch
                        onChange={handleChange}
                        id={"flashlight"}
                    />

                </div>

                 <Button type={"submit"}> Create </Button>
                 <Link to={"/alerts"}><Button> Cancel </Button></Link>
            </form>
        </div>
    );
}