import {useFormik} from "formik";
import {Button, makeStyles, TextField} from "@material-ui/core";
import {passwordResetValidationSchema} from "../../../Helpers/Validation/PasswordResetValidation";
import {useContext, useState} from "react";
import UserContext from "../../../contexts/Auth/authContext";
import {ErrorDialog} from "../../Popup/ErrorPopup/ErrorPopUp";

const useStyles = makeStyles({
    button: {
        marginTop: '20px',
        backgroundColor: 'white',
        color: 'black',
        fontFamily: 'Raleway',
        fontSize: '15px',
        width: '222px',
        textAlign: 'center',
        textDecoration: 'none',
        marginBottom: '5%',
    },
})

export default function PasswordResetForm({onClick}) {
    const {sendResetEmail} = useContext(UserContext)
    const [error, setError] = useState(null);
    const classes = useStyles();
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

                <h1>Password Reset</h1>
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

                <Button className={classes.button} type={"submit"} variant={"contained"}
                        size={"large"}><b>Submit</b></Button>

                <p onClick={handleCancel}>Cancel</p>

            </form>
        </div>

    );
}