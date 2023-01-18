import {Button, TextField} from "@material-ui/core";
import {UserAuth} from "../../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import {loginSchema} from "../../../Helpers/Validation/LoginValidation";
import {useFormik} from "formik";
import "./loginForm.css"

export default function LoginForm() {
    const { logIn } = UserAuth()
    const navigate = useNavigate()

    const onSubmit = () => {
        logIn(values.email, values.password)
        navigate('/alerts')
    }

    const { handleSubmit, values, handleChange, handleBlur, errors, touched } = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: loginSchema,
        onSubmit,
    })

    return(
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
                    InputProps={{disableUnderline: true, inputProps: { style: {backgroundColor: 'white', borderRadius: '10px' }}}} />
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
                    InputProps={{disableUnderline: true, inputProps: { style: {backgroundColor: 'white', borderRadius: '10px' }}}} />
            </div>

            <Button  className={"button"} type={"submit"} variant={"contained"} size={"large"} ><b>Login</b></Button>

        </form>
    );
}