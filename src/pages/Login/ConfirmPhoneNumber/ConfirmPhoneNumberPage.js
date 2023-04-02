import React, {useContext, useState} from "react";
import {Button, TextField} from "@material-ui/core";
import {useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import UserContext from "../../../contexts/Auth/authContext";
import {getUserPhoneNumberFromDB} from "../../../model/db/DB";
import {phoneConfirmValidationSchema} from "../../../Helpers/Validation/PhoneConfirmValidation";
import {ErrorDialog} from "../../../components/Popup/ErrorPopup/ErrorPopUp";


function ConfirmPhoneNumberPage() {
    const {sendVerificationSMS, verifyCode} = useContext(UserContext)
    const [smsSent, setSMSSent] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    const onSubmit = async () => {
        const phoneNumber = await getUserPhoneNumberFromDB()
        if (phoneNumber === values.phoneNumber) {
            try {
                await sendVerificationSMS("+353" + values.phoneNumber, "submitPhoneNumber")
                setSMSSent(true)
            } catch (error) {
                setError(error.message);
            }
        } else {
            setError("Phone Number does not match");
        }
    }

    const {handleSubmit, values, handleChange, handleBlur, errors, touched} = useFormik({
        initialValues: {
            phoneNumber: "",
            code: "",
        },
        validationSchema: phoneConfirmValidationSchema,
        onSubmit,
    })

    function handleCancel() {
        navigate("/alerts")
    }

    async function handleResend() {
        try {
            await sendVerificationSMS("+353" + values.phoneNumber, "submitPhoneNumber")
        } catch (error) {
            setError(error.message)
        }
    }

    async function sendCode() {
        try {
            await verifyCode(values.code)
            navigate("/alerts")
        } catch (error) {
            setError(error.message);
        }
    }

    const handleCloseError = () => {
        setError(null);
        return false
    };

    return (
        <div>
            {smsSent ? (
                <form onSubmit={handleSubmit} autoComplete={"off"}>
                    <p>Please enter the 6 figure verification code you should have received, if no code has been
                        received you can try to resend the code.</p>

                    <div>
                        {error && <ErrorDialog message={error} onCloseClick={handleCloseError}/>}
                    </div>

                    <div>
                        <TextField
                            error={!!(errors.code && touched.code)}
                            label={errors.code && touched.code ? "Invalid code" : "code"}
                            helperText={errors.code && touched.code ? errors.code : " "}
                            value={values.code}
                            variant="filled"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type={"number"}
                            className={"textField"}
                            id={"code"}
                            placeholder={"code"}
                            InputProps={{
                                disableUnderline: true,
                                inputProps: {style: {backgroundColor: 'white', borderRadius: '10px'}}
                            }}/>
                    </div>

                    <Button onClick={sendCode}>Submit</Button>
                    <Button onClick={handleResend}> Resend</Button>
                </form>
            ) : (
                <form onSubmit={handleSubmit} autoComplete={"off"}>
                    <p>Please confirm your phone number, so we can verify it.</p>
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

                    <div>
                        {error && <ErrorDialog message={error} onCloseClick={handleCloseError}/>}
                    </div>

                    <Button id={"submitPhoneNumber"} onClick={onSubmit}> Submit</Button>
                    <Button onClick={handleCancel}> Cancel</Button>
                </form>
            )}
        </div>
    );
}


export default ConfirmPhoneNumberPage;
