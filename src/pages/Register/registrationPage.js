import {makeStyles} from "@material-ui/core";
import "@fontsource/raleway";
import RegistrationForm from "../../components/Forms/registrationForm/registrationForm";
import {Link} from "react-router-dom";

const useStyles = makeStyles({
    container: {
        textAlign: 'center',
        display: 'block',
        fontFamily: "Raleway",

        height: '100%',
        overflow: 'auto',
    },
    link: {
        textDecoration: 'none',
        color: 'white'
    },
})

function RegistrationPage() {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <div>
                <img src={require("../../assets/images/airdeall.png")} alt={""}/>
            </div>
            <RegistrationForm/>
            <Link to={"/login"} className={classes.link}><p>Already a user ? Login here</p></Link>
        </div>
    );
}

export default RegistrationPage;