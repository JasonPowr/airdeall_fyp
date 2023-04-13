import {makeStyles} from "@material-ui/core";
import "@fontsource/raleway";
import LoginForm from "../../../components/Forms/loginForm/loginForm";
import {useContext, useEffect, useState} from "react";
import PasswordResetForm from "../../../components/Forms/PasswordResetForm/passwordResetForm";
import UserContext from "../../../contexts/Auth/authContext";
import {Link, useNavigate} from "react-router-dom";

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
    const navigate = useNavigate()
    const {user} = useContext(UserContext)

    function showForm(showForm) {
        setShowPasswordReset(showForm)
    }

    useEffect(() => {
        if (user != null) {
            if (user.phoneNumber !== undefined) {
                if (user.phoneNumber === null) {
                    navigate("/extraDetails")
                } else {
                    navigate("/alerts")
                }
            }
        }
    }, [user]);

    const classes = useStyles();
    return (
        <div>
            {user ? (
                <div>Loading ....</div>
            ) : (
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
                        <Link to={"/"} className={classes.link}><p>Cancel</p></Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoginPage;