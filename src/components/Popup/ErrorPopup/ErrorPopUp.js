import * as React from 'react';
import {useState} from 'react';
import {Alert, Collapse, IconButton} from "@mui/material";
import {Close} from "@material-ui/icons";
import styles from "./ErrorPopup.module.css"

export function ErrorDialog({message, onCloseClick}) {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(onCloseClick)
    }

    return (
        <Collapse in={open} className={styles.popup}>
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
    );
}

//https://mui.com/material-ui/react-dialog/