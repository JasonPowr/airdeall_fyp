import SafePointRegistrationForm from "../../../components/Forms/SafePointRegistrationForm/SafePointRegistrationForm";
import {Link} from "react-router-dom";
import {useState} from "react";
import "./SafePointReg.css"

function SafePointRegistrationPage() {
    const [submitted, setIsSubmitted] = useState(false)
    return (
        <div className={"safePoint-reg"}>
            {submitted ? (
                <div>
                    <p>Submitted</p>
                    <Link to={"/"}><p>Return Home</p></Link>
                </div>

            ) : (

                <div>
                    <h4> Please fill out the form below....</h4>
                    <SafePointRegistrationForm setIsSubmitted={setIsSubmitted}/>
                    <Link to={"/"}><p>Cancel</p></Link>
                </div>
            )}

        </div>
    );
}

export default SafePointRegistrationPage;