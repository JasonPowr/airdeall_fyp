import {Button, TextField} from "@material-ui/core";
import UserContext from "../../../contexts/Auth/authContext";
import {Link, useNavigate} from "react-router-dom";
import {loginSchema} from "../../../Helpers/Validation/LoginValidation";
import {useFormik} from "formik";
import "./loginForm.css"
import {useContext} from "react";

export default function LoginForm({onClick}) {
    const {logIn} = useContext(UserContext)
    const navigate = useNavigate()

    const onSubmit = async () => {
        await logIn(values.email, values.password)
        navigate('/alerts')
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

    return (
        <form onSubmit={handleSubmit} autoComplete={"off"}>

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

            <Button className={"button"} type={"submit"} variant={"contained"} size={"large"}><b>Login</b></Button>
            <p onClick={handlePasswordResetClick}>Forgot Password ?</p>
            <Link to={"/register"}><p>Not a User? Register Here....</p></Link>
        </form>
    );
}