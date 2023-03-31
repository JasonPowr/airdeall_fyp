import {useFormik} from "formik";
import {Button, TextField} from "@material-ui/core";
import {passwordResetValidationSchema} from "../../../Helpers/Validation/PasswordResetValidation";
import {useContext, useState} from "react";
import UserContext from "../../../contexts/Auth/authContext";
import {ErrorDialog} from "../../Popup/ErrorPopup/ErrorPopUp";

export default function PasswordResetForm({onClick}) {
    const {sendResetEmail} = useContext(UserContext)
    const [error, setError] = useState(null);
    const onSubmit = async () => {
        try {
            await sendResetEmail(values.email);
            onClick(false);
        } catch (error) {
            setError(error.message);
        }
    };

    const {handleSubmit, values, handleChange, handleBlur, errors, touched,} = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: passwordResetValidationSchema,
        onSubmit,
    });

    function handleCancel() {
        onClick(false)
    }

    const handleCloseError = () => {
        setError(null);
        return false
    };

    return (
        <div>
            <form onSubmit={handleSubmit} autoComplete={"off"}>

                <div>
                    {error && <ErrorDialog message={error} onCloseClick={handleCloseError}/>}
                </div>

                <p>Please enter your email address below</p>

                <div>
                    <TextField
                        error={!!(errors.email && touched.email)}
                        label={errors.email && touched.email ? "Invalid Email" : "Email"}
                        helperText={errors.email && touched.email ? errors.email : " "}
                        value={values.email}
                        variant="filled"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={"textField"}
                        id={"email"}
                        type={"email"}
                        placeholder={"Email"}
                        InputProps={{
                            disableUnderline: true,
                            inputProps: {style: {backgroundColor: 'white', borderRadius: '10px'}}
                        }}/>
                </div>

                <Button className={"button"} type={"submit"} variant={"contained"} size={"large"}><b>Send
                    Password Reset
                    Email</b></Button>

                <p onClick={handleCancel}>Cancel</p>

            </form>
        </div>

    );
}