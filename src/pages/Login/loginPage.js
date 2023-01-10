import {makeStyles} from "@material-ui/core";
import LoginButton from "../../components/Buttons/loginButton";
import {Link} from "react-router-dom";
import "@fontsource/raleway";
import LoginForm from "../../components/Forms/loginForm";

const useStyles = makeStyles({
    container: {
        textAlign: 'center',
        display: 'block',
        fontFamily: "Raleway",
    },
    link:{
        textDecoration: 'none',
        color: 'white'
    },
    footer :{
        position: 'absolute',
        bottom: '5%',
        width: '100%',
    },
})

function LoginPage() {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <div>
                <img src={require("../../assets/airdeall.png")} alt={""}/>
            </div>

            <LoginForm />

            <div className={classes.footer}>
                <Link className={classes.link}  to={""}><LoginButton/></Link>
                <Link className={classes.link}  to={""}><p>Forgot Password?</p></Link>
            </div>
        </div>
    );
}

export default LoginPage;