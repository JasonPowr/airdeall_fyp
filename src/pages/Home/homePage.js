import {makeStyles} from "@material-ui/core";
import LoginButton from "../../components/Buttons/loginButton";
import {Link} from "react-router-dom";
import "@fontsource/raleway";

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
    }
})

function HomePage() {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <div>
                <img src={require("../../assets/airdeall.png")} alt={""}/>
                <p style={{fontSize: '30px'}}> <b> Welcome! </b></p>
                <p>Please login or register</p>
            </div>

            <div className={classes.footer}>
                <Link to={"/login"} className={classes.link} ><LoginButton/></Link>
                <Link to={"/register"} className={classes.link} ><p>Not a User? Register Here....</p></Link>
            </div>
        </div>
    );
}

export default HomePage;