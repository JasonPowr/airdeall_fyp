import {Button, makeStyles} from "@material-ui/core";
import "@fontsource/raleway";

const useStyles = makeStyles({
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

export default function LoginButton() {
    const classes = useStyles();
    return(
            <Button className={classes.button} variant={"contained"} size={"large"} ><b>Login</b></Button>
    );
}