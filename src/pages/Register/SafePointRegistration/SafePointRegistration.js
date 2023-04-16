import SafePointRegistrationForm from "../../../components/Forms/SafePointRegistrationForm/SafePointRegistrationForm";
import {Link} from "react-router-dom";
import {useState} from "react";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
    container: {
        textAlign: 'center',
        display: 'block',
        fontFamily: "Raleway",
        height: '100%',
        overflow: 'auto',
    },
})

function SafePointRegistrationPage() {
    const classes = useStyles();
    const [submitted, setIsSubmitted] = useState(false)
    return (
        <div className={classes.container}>
            {submitted ? (
                <div>
                    <p>Submitted</p>
                    <Link to={"/"}><p>Return Home</p></Link>
                </div>

            ) : (
                <div className={classes.container}>
                    <SafePointRegistrationForm setIsSubmitted={setIsSubmitted}/>
                </div>
            )}

        </div>
    );
}

export default SafePointRegistrationPage;