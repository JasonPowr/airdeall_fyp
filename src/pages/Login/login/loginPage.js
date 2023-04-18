import {makeStyles} from "@material-ui/core";
import "@fontsource/raleway";
import LoginForm from "../../../components/Forms/loginForm/loginForm";
import {useContext, useEffect, useState} from "react";
import PasswordResetForm from "../../../components/Forms/PasswordResetForm/passwordResetForm";
import UserContext from "../../../contexts/Auth/authContext";
import {useNavigate} from "react-router-dom";
import Loading from "../../../components/Loading/Loading";

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
    img: {
        height: "180px",
        width: "180px",
        paddingTop: "60px",
        opacity: "70%"
    }
})

function LoginPage() {
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const navigate = useNavigate()
    const {user} = useContext(UserContext)
    const classes = useStyles();

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

    return (
        <div>
            {user ? (
                <Loading/>
            ) : (
                <div className={classes.container}>
                    <div>
                        <img className={classes.img} src={require("../../../assets/Airdeall.png")} alt={""}/>
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
            )}
        </div>
    );
}

export default LoginPage;