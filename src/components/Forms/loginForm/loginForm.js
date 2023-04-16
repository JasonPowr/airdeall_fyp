import {Button, makeStyles, TextField} from "@material-ui/core";
import UserContext from "../../../contexts/Auth/authContext";
import {Link, useNavigate} from "react-router-dom";
import {loginSchema} from "../../../Helpers/Validation/LoginValidation";
import {useFormik} from "formik";
import "./loginForm.css"
import {useContext, useState} from "react";
import {ErrorDialog} from "../../Popup/ErrorPopup/ErrorPopUp";
import GoogleButton from 'react-google-button'


const useStyles = makeStyles({
    googleBtn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    link: {
        textDecoration: 'none',
        color: 'white'
    },
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

export default function LoginForm({onClick}) {
    const {logIn, loginWithGoogle} = useContext(UserContext)
    const navigate = useNavigate()
    const [error, setError] = useState(null);
    const classes = useStyles();

    const onSubmit = async () => {
        try {
            await logIn(values.email, values.password)
            navigate('/alerts')
        } catch (error) {
            setError(error.message);
        }
    }

    const {handleSubmit, values, handleChange, handleBlur, errors, touched} = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: loginSchema,
        onSubmit,
    })

    function handlePasswordResetClick() {
        onClick(true)
    }

    const handleCloseError = () => {
        setError(null);
        return false
    };

    async function handleGoogleAuth() {
        try {
            await loginWithGoogle()
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <form onSubmit={handleSubmit} autoComplete={"off"}>

            {error && <ErrorDialog message={error} onCloseClick={handleCloseError}/>}

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

            <div>
                <TextField
                    error={!!(errors.password && touched.password)}
                    label={errors.password && touched.password ? "Invalid Password" : "Password"}
                    helperText={errors.password && touched.password ? errors.password : " "}
                    value={values.password}
                    onChange={handleChange}
                    variant="filled"
                    onBlur={handleBlur}
                    className={"textField"}
                    id={"password"}
                    type={"password"}
                    placeholder={"Password"}
                    InputProps={{
                        disableUnderline: true,
                        inputProps: {style: {backgroundColor: 'white', borderRadius: '10px'}}
                    }}/>
            </div>

            <Button className={classes.button} type={"submit"} variant={"contained"}
                    size={"large"}><b>Login</b></Button>
            <p onClick={handlePasswordResetClick}>Forgot Password ?</p>
            <Link to={"/register"} className={classes.link}><p>Not a User? Register Here</p></Link>

            <div className={classes.googleBtn}>
                <GoogleButton onClick={handleGoogleAuth}/>
            </div>

        </form>
    );
}
//https://www.npmjs.com/package/react-google-button