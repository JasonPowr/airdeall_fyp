import * as React from 'react';
import {useContext, useState} from 'react';
import {Alert, Collapse, IconButton} from "@mui/material";
import {Close, Email, Phone} from "@material-ui/icons";
import UserContext from "../../../contexts/Auth/authContext";
import {useNavigate} from "react-router-dom";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
    popup: {
        maxWidth: '600px',
        width: '90%',
        margin: "auto",
    }
})

export function WarningPopUp({message, onCloseClick, context}) {
    const navigate = useNavigate()
    const [open, setOpen] = useState(true);
    const [emailSent, setEmailSent] = useState(false);
    const {sendVerifyEmailAddress} = useContext(UserContext)
    const classes = useStyles();

    const handleClose = () => {
        setOpen(onCloseClick)
    }

    async function handleVerifyEmail() {
        setEmailSent(true)
        sendVerifyEmailAddress()

        setTimeout(function () {
            setEmailSent(false)
        }, 2000);
    }

    function handlePhoneVerification() {
        navigate("/confirmNumber")
    }

    return (
        <Collapse in={open} className={classes.popup}>
            <Alert
                severity="warning"
                action={
                    <div>
                        {(context === "email") && (<IconButton
                            color="inherit"
                            size="small"
                            onClick={handleVerifyEmail}
                        >
                            <Email fontSize="inherit"/>
                        </IconButton>)}

                        {(context === "phone") && (<IconButton
                            color="inherit"
                            size="small"
                            onClick={handlePhoneVerification}
                        >
                            <Phone fontSize="inherit"/>
                        </IconButton>)}

                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={handleClose}
                        >
                            <Close fontSize="inherit"/>
                        </IconButton>

                    </div>
                }
                sx={{mb: 2}}
            >
                {message}
            </Alert>

            {emailSent && (<Alert
                severity="success"
                action={
                    <div>

                    </div>
                }
                sx={{mb: 2}}
            >
                Verification email sent
            </Alert>)}


        </Collapse>
    );
}

//https://mui.com/material-ui/react-alert/