import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import {DialogTitle} from "@mui/material";
import {CancelAlert} from "../../Alerts/activateAlert";

export function AlertDialog({alert, isAlertActive, setIsAlertActive, isAlertInCountdown, setAlertInCountdown}) {

    function handleCancel() {
        setIsAlertActive(false)
        setAlertInCountdown(false)
        CancelAlert({alert})
    }

    if (isAlertInCountdown) {
        return (
            <Dialog
                open={isAlertInCountdown}
            >
                <DialogTitle>
                    {"Alert In Countdown"}
                </DialogTitle>

                <DialogActions>
                    <Button onClick={handleCancel}>Cancel Alert</Button>
                </DialogActions>

            </Dialog>
        )
    }

    if (isAlertActive) {
        return (
            <Dialog open={isAlertActive}>
                <DialogTitle>
                    {"Alert Activated"}
                </DialogTitle>

                <DialogActions>
                    <Button onClick={handleCancel}>Cancel Alert</Button>
                </DialogActions>

            </Dialog>
        )
    }

}

//https://mui.com/material-ui/react-dialog/