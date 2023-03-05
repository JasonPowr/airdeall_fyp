import {Button, TextField} from "@material-ui/core";
import {UserAuth} from "../../../contexts/Auth/authContext";
import {useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import {registrationSchema} from "../../../Helpers/Validation/RegistrationValidation";
import "./registrationForm.css"

export default function RegistrationForm() {
    const {createUser} = UserAuth()
    const navigate = useNavigate()

    const onSubmit = (e) => {
        createUser(values.email, values.password, values.firstName, values.lastName, values.phoneNumber)
        navigate('/alerts')
    }

    const {handleSubmit, values, handleChange, handleBlur, errors, touched} = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            phoneNumber: "",
        },
        validationSchema: registrationSchema,
        onSubmit,
    })

    return (
        <form onSubmit={handleSubmit} autoComplete={"off"}>

            <div>
                <TextField
                    error={!!(errors.firstName && touched.firstName)}
                    label={errors.firstName && touched.firstName ? "Invalid First Name" : "First Name"}
                    helperText={errors.firstName && touched.firstName ? errors.firstName : " "}
                    value={values.firstName}
                    variant="filled"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={"textField"}
                    id={"firstName"}
                    placeholder={"First Name"}
                    InputProps={{
                        disableUnderline: true,
                        inputProps: {style: {backgroundColor: 'white', borderRadius: '10px'}}
                    }}/>
            </div>

            <div>
                <TextField
                    error={!!(errors.lastName && touched.lastName)}
                    label={errors.lastName && touched.lastName ? "Invalid Last Name" : "Last Name"}
                    helperText={errors.lastName && touched.lastName ? errors.lastName : " "}
                    value={values.lastName}
                    variant="filled"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={"textField"}
                    id={"lastName"}
                    placeholder={"Last Name"}
                    InputProps={{
                        disableUnderline: true,
                        inputProps: {style: {backgroundColor: 'white', borderRadius: '10px'}}
                    }}/>
            </div>

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
                    variant="filled"
                    onChange={handleChange}
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

            <div>
                <TextField
                    error={!!(errors.confirmPassword && touched.confirmPassword)}
                    label={errors.confirmPassword && touched.confirmPassword ? "Passwords dont match" : "Confirm Password"}
                    helperText={errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : " "}
                    value={values.confirmPassword}
                    variant="filled"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type={"password"}
                    className={"textField"}
                    id={"confirmPassword"}
                    placeholder={"Confirm Password"}
                    InputProps={{
                        disableUnderline: true,
                        inputProps: {style: {backgroundColor: 'white', borderRadius: '10px'}}
                    }}/>
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

            <Button className={"button"} type={"submit"} variant={"contained"} size={"large"}><b>Register</b></Button>

        </form>
    );
}