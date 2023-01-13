import {Button, makeStyles, TextField} from "@material-ui/core";
import {Grid} from "@mui/material";
import {UserAuth} from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import {useState} from "react";

const useStyles = makeStyles({
    textField: {
        backgroundColor: 'white',
        color:'black',
        borderRadius:'10px',
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
export default function LoginForm() {
    const classes = useStyles();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { logIn } = UserAuth()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        try {
            logIn(email, password)
            navigate('/alerts')
        }catch (e) {
            setError(e.message)
            console.log(e.message)
        }
    }

    return(
        <Grid container direction={"column"} spacing={5}>
            <Grid item>
                <TextField onChange={(e) =>{setEmail(e.target.value)}} className={classes.textField} label="Email" type={"email"} variant="filled" />
            </Grid>
            <Grid item>
                <TextField onChange={(e) =>{setPassword(e.target.value)}} className={classes.textField} label="Password" type={"password"} variant="filled" />
            </Grid>
            <Grid item>
                <Button onClick={handleSubmit} className={classes.button} variant={"contained"} size={"large"} ><b>Login</b></Button>
            </Grid>

        </Grid>
    );
}