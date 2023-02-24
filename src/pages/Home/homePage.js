import {Button, makeStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import "@fontsource/raleway";

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
    button: {
        marginTop: '20px',
        backgroundColor: '#ffac4b',
        color: 'black',
        fontFamily: 'Raleway',
        fontSize: '15px',
        width: '222px',
        textAlign: 'center',
    }
})

function HomePage() {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <div>
                <img src={require("../../assets/images/airdeall.png")} alt={""}/>
                <p style={{fontSize: '30px'}}><b> Welcome! </b></p>
                <p>Please login or register</p>
            </div>

            <div className={classes.footer}>
                <Link to={"/login"}> <Button className={classes.button} variant={"contained"}
                                             size={"large"}><b>Login</b></Button></Link>
                <Link to={"/register"} className={classes.link}><p>Not a User? Register Here....</p></Link>
            </div>
        </div>
    );
}

export default HomePage;