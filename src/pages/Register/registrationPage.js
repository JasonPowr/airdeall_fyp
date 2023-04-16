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
    img: {
        height: "180px",
        width: "180px",
        paddingTop: "60px",
        paddingBottom: "50px",
    }
})

function RegistrationPage() {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <div>
                <img className={classes.img} src={require("../../assets/Airdeall.png")} alt={""}/>
            </div>
            <RegistrationForm/>
            <Link to={"/login"} className={classes.link}><p>Already a user ? Login here</p></Link>
            <Link to={"/"} className={classes.link}><p>Cancel</p></Link>
        </div>
    );
}

export default RegistrationPage;