import {makeStyles, TextField} from "@material-ui/core";
import {Grid} from "@mui/material";

const useStyles = makeStyles({
    textField: {
        backgroundColor: 'white',
        color:'black',
        borderRadius:'10px',
    }
})
export default function RegistrationForm() {

    const classes = useStyles();
    return(
        <Grid container direction={"column"} spacing={5}>
            <Grid item>
                <TextField className={classes.textField} label="First Name" type={"text"} variant="filled" />
            </Grid>
            <Grid item>
                <TextField className={classes.textField} label="Last Name" type={"text"} variant="filled" />
            </Grid>
            <Grid item>
                <TextField className={classes.textField} label="Email" type={"email"} variant="filled" />
            </Grid>
            <Grid item>
                <TextField className={classes.textField} label="Password" type={"password"} variant="filled" />
            </Grid>
            <Grid item>
                <TextField className={classes.textField} label="Password" type={"password"} variant="filled" />
            </Grid>
        </Grid>


    );
}