import {makeStyles} from "@material-ui/core";
import "@fontsource/raleway";
import LoginForm from "../../../components/Forms/loginForm/loginForm";
import {useState} from "react";
import PasswordResetForm from "../../../components/Forms/PasswordResetForm/passwordResetForm";

const useStyles = makeStyles({
    container: {
        textAlign: 'center',
        display: 'block',
        fontFamily: "Raleway",
    },
    link: {
        textDecoration: 'none',
        color: 'white'
    },
    footer: {
        position: 'absolute',
        bottom: '5%',
        width: '100%',
    },
})

function LoginPage() {
    const [showPasswordReset, setShowPasswordReset] = useState(false);

    function showForm(showForm) {
        setShowPasswordReset(showForm)
    }

    const classes = useStyles();
    return (
        <div className={classes.container}>
            <div>
                <img src={require("../../../assets/images/airdeall.png")} alt={""}/>
            </div>

            <div className={classes.footer}>

                {showPasswordReset ? (
                    <div>
                        <PasswordResetForm onClick={showForm}/>
                    </div>
                ) : (
                    <div>
                        <LoginForm onClick={showForm}/>
                    </div>
                )}

            </div>
        </div>
    );
}

export default LoginPage;