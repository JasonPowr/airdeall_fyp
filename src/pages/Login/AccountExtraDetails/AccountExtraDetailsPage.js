import React, {useContext, useState} from "react";
import UserContext from "../../../contexts/Auth/authContext";
import {useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import {registrationSchema} from "../../../Helpers/Validation/RegistrationValidation";
import {ErrorDialog} from "../../../components/Popup/ErrorPopup/ErrorPopUp";
import {Button, TextField} from "@material-ui/core";
import {updateProfileOnRegister} from "../../../model/db/DB";

export default function AccountExtraDetailsPage() {
    const {user, deleteUserAccount} = useContext(UserContext)
    const navigate = useNavigate()
    const [error, setError] = useState(null);

    const onSubmit = async () => {
        try {
            await updateProfileOnRegister(user.auth, user.displayName, "", user.email, values.phoneNumber)
            navigate('/confirmNumber')
        } catch (error) {
            setError(error.message);
        }
    }

    const {handleSubmit, values, handleChange, handleBlur, errors, touched} = useFormik({
        initialValues: {
            phoneNumber: "",
        },
        validationSchema: registrationSchema,
    })

    const handleCloseError = () => {
        setError(null);
        return false
    };


    async function handleCancel() {
        await deleteUserAccount()
        navigate('/')
    }

    return (
        <form onSubmit={handleSubmit} autoComplete={"off"}>

            <p>In order for you to use certain features in Airdeall you will need to sign up using your phone number,
                please enter your phone number below.</p>

            <div>
                {error && <ErrorDialog message={error} onCloseClick={handleCloseError}/>}
            </div>

            <div>
                <TextField
                    error={!!(errors.phoneNumber && touched.phoneNumber)}
                    label={errors.phoneNumber && touched.phoneNumber ? "Invalid Phone Number" : "Phone Number"}
                    helperText={errors.phoneNumber && touched.phoneNumber ? errors.phoneNumber : " "}
                    value={values.phoneNumber}
                    variant="filled"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type={"number"}
                    className={"textField"}
                    id={"phoneNumber"}
                    placeholder={"Phone Number"}
                    InputProps={{
                        disableUnderline: true,
                        inputProps: {style: {backgroundColor: 'white', borderRadius: '10px'}}
                    }}/>
            </div>

            <Button className={"button"} type={"submit"} variant={"contained"} size={"large"}
                    onClick={onSubmit}><b>Register</b></Button>

            <Button className={"button"} type={"submit"} variant={"contained"} size={"large"}
                    onClick={handleCancel}><b>Cancel</b></Button>

        </form>
    );
}