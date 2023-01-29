import {Button, TextField} from "@material-ui/core";
import {Link} from "react-router-dom";
import {useFormik} from "formik";
import {createAlertValidationSchema} from "../../Helpers/Validation/CreateAlertValidation";
import firebase, {auth, db} from "../../firebase";
import {doc, setDoc} from "firebase/firestore";

export default function CreateAlertPage() {

    let alertTitle;
    const alert = { alertTitle }
    const onSubmit = async () => {
        alert.alertTitle = values.title

        const alertsDocRef = doc(db,'users',`${auth.currentUser.uid}`);
        setDoc(alertsDocRef, {
            Alerts : {
                 [`${values.title}`]: alert
            }
        }, { merge: true });

        console.log("Alert created with title: " + alert.alertTitle)
    }

    const { handleSubmit, values, handleChange, handleBlur, errors, touched } = useFormik({
        initialValues: {
            title: "",
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

                 <Button type={"submit"}> Create </Button>
                 <Link to={"/alerts"}><Button> Cancel </Button></Link>

            </form>
        </div>
    );
}