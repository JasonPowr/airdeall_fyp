import {makeStyles} from "@material-ui/core";
import "@fontsource/raleway";
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
})

function RegistrationPage() {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <div>
                <img src={require("../../assets/airdeall.png")} alt={""}/>
            </div>

            <RegistrationForm />
        </div>
    );
}

export default RegistrationPage;