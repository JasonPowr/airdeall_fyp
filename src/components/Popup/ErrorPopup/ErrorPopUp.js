import * as React from 'react';
import {useState} from 'react';
import {Alert, Collapse, IconButton} from "@mui/material";
import {Close} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core";


const useStyles = makeStyles({
    container: {
        textAlign: 'center',
        display: 'block',
        fontFamily: "Raleway",
        margin: "auto",
        width: "80%",
        maxWidth: "300px",
    },
})

export function ErrorDialog({message, onCloseClick}) {
    const [open, setOpen] = useState(true);
    const classes = useStyles();

    const handleClose = () => {
        setOpen(onCloseClick)
    }

    return (
        <div className={classes.container}>
            <Collapse in={open}>
                <Alert
                    variant="filled"
                    severity="error"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={handleClose}
                        >
                            <Close fontSize="inherit"/>
                        </IconButton>
                    }
                    sx={{mb: 2}}
                >
                    {message}
                </Alert>
            </Collapse>
        </div>
    );
}

//https://mui.com/material-ui/react-dialog/