import {Button, makeStyles} from "@material-ui/core";
import {Link, useNavigate} from "react-router-dom";
import "@fontsource/raleway";
import {useContext, useEffect, useState} from "react";
import UserContext from "../../contexts/Auth/authContext";
import Loading from "../../components/Loading/Loading";

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
        bottom: '2%',
        width: '100%',
    },
    button: {
        marginTop: '20px',
        backgroundColor: 'white',
        color: 'black',
        fontFamily: 'Raleway',
        fontSize: '15px',
        width: '222px',
        textAlign: 'center',
        textDecoration: 'none',
        marginBottom: '5%',
    },
    img: {
        height: "180px",
        width: "180px",
        paddingTop: "60px",
        opacity: "70%"
    }
})

function HomePage() {
    const classes = useStyles();
    const {user} = useContext(UserContext);
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        if (user === null) {
            setIsUserLoading(false);
        } else {
            setIsUserLoading(false);
            setIsAuthenticated(true)
        }

        if (isAuthenticated) {
            navigate("/alerts")
        }

    }, [user]);

    return (
        <div>
            {(isUserLoading || isAuthenticated) ? (
                <Loading/>
            ) : (
                <div className={classes.container}>
                    <div>
                        <img src={require("../../assets/Airdeall.png")} alt={""} className={classes.img}/>
                        <p style={{fontSize: '30px'}}><b> Welcome to Airdeall</b></p>
                        <p>Please login or register</p>
                    </div>

                    <div className={classes.footer}>
                        <Link to={"/login"} className={classes.link}> <Button className={classes.button}
                                                                              variant={"contained"}
                                                                              size={"large"}><b>Login</b></Button></Link>
                        <Link to={"/register"} className={classes.link}><p>Not a User? Register Here</p></Link>
                        <Link to={"/register_safePoint"} className={classes.link}><p>Register here as a Safe Point</p>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HomePage;