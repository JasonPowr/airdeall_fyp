import {makeStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import "@fontsource/raleway";
import RegisterButton from "../../components/Buttons/registerButton";
import RegistrationForm from "../../components/Forms/registrationForm";

const useStyles = makeStyles({
    container: {
        textAlign: 'center',
        display: 'block',
        fontFamily: "Raleway",

        height: '100%',
        overflow: 'auto',
    },
    link:{
        textDecoration: 'none',
        color: 'white'
    },
    footer :{
        marginTop: '20px',
        width: '100%',
        marginBottom: '20px',
    },
})

function RegistrationPage() {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <div>
                <img src={require("../../assets/airdeall.png")} alt={""}/>
            </div>

            <RegistrationForm />

            <div className={classes.footer}>
                <Link className={classes.link}  to={""}><RegisterButton/></Link>
            </div>
        </div>
    );
}

export default RegistrationPage;