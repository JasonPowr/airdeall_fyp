import React, {useContext, useState} from "react";
import UserContext from "../../../contexts/Auth/authContext";
import {useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import {registrationSchema} from "../../../Helpers/Validation/RegistrationValidation";
import {ErrorDialog} from "../../../components/Popup/ErrorPopup/ErrorPopUp";
import {Button, makeStyles, TextField} from "@material-ui/core";
import {updateProfileOnRegister} from "../../../model/db/DB";


const useStyles = makeStyles({
    container: {
        paddingTop: '80px',
        textAlign: 'center',
        display: 'block',
        fontFamily: "Raleway",
        height: '100%',
        overflow: 'auto',
    },
    btn: {
        paddingBottom: '20px'
    },
    text: {
        width: '70%',
        fontSize: '15px',
        margin: "auto",
    },
    img: {
        height: "180px",
        width: "180px",
        paddingBottom: "50px",
    }
})


export default function AccountExtraDetailsPage() {
    const classes = useStyles();
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
        <form onSubmit={handleSubmit} autoComplete={"off"} className={classes.container}>

            <div>
                <img className={classes.img} src={require("../../../assets/Airdeall.png")} alt={""}/>
            </div>


            <div className={classes.text}>
                <p><b>In order for you to use certain features in Airdeall you will
                    need to sign up using your phone number,
                    please enter your phone number below.</b></p>
            </div>

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

            <div className={classes.btn}>
                <Button className={"button"} type={"submit"} variant={"contained"} size={"large"}
                        onClick={onSubmit}><b>Register</b></Button>

            </div>

            <div>
                <Button className={"button"} variant={"contained"} size={"large"}
                        onClick={handleCancel}><b>Cancel</b></Button>
            </div>

        </form>
    );
}