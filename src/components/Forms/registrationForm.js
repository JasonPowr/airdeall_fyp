import {Button, makeStyles, TextField} from "@material-ui/core";
import {Grid} from "@mui/material";
import {useState} from "react";
import {UserAuth} from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";

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
        marginBottom: '20px',
    }
})

export default function RegistrationForm() {
    const classes = useStyles();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { createUser } = UserAuth()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        try {
            createUser(email, password)
            navigate('/alerts')
        }catch (e) {
            setError(e.message)
            console.log(e.message)
        }
    }

    return(
        <Grid container direction={"column"} spacing={5}>
                <Grid item>
                    <TextField className={classes.textField} label="First Name" type={"text"} variant="filled" />
                </Grid>
                <Grid item>
                    <TextField className={classes.textField} label="Last Name" type={"text"} variant="filled" />
                </Grid>
                <Grid item>
                    <TextField className={classes.textField} onChange={(e) =>{setEmail(e.target.value)}} label="Email" type={"email"} variant="filled" />
                </Grid>
                <Grid item>
                    <TextField className={classes.textField} onChange={(e) =>{setPassword(e.target.value)}} label="Password" type={"password"} variant="filled" />
                </Grid>
                <Grid item>
                    <TextField className={classes.textField} label="Password" type={"password"} variant="filled" />
                </Grid>
                <Grid item>
                    <Button  onClick={handleSubmit} className={classes.button} variant={"contained"} size={"large"} ><b>Register</b></Button>
                </Grid>
        </Grid>

    );
}