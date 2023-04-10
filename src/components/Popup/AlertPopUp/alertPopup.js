import * as React from 'react';
import {useRef, useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import {Box, CircularProgress, DialogTitle, Typography} from "@mui/material";
import {CancelAlert} from "../../Alerts/activateAlert";

export function AlertDialog({alert, isAlertActive, setIsAlertActive, isAlertInCountdown, setAlertInCountdown}) {
    let time = 0;
    let [timer, setTimer] = useState(0);
    let countdownTimer = useRef(null);
    let countdownTimeout = useRef(null);

    function startCountdown() {

        countdownTimer = setInterval(() => {
            time = timer += 1
            setTimer(time)
        }, 1000);

        countdownTimeout = setTimeout(() => {
            clearInterval(countdownTimer.current);
            clearInterval(countdownTimeout.current);
            setAlertInCountdown(false)
        }, 30000);

    }

    function handleCancel() {
        clearInterval(countdownTimer.current);
        clearInterval(countdownTimeout.current);

        CancelAlert({alert});
        setIsAlertActive(false);
        setAlertInCountdown(false);
    }

    if (isAlertInCountdown) {
        time = 0
        startCountdown()
        return (
            <Dialog
                open={isAlertInCountdown}
            >
                <DialogTitle>
                    {"Alert In Countdown"}
                </DialogTitle>

                <Box>
                    <CircularProgress variant="determinate" value={(timer / 30) * 100}/>
                    <Typography
                        variant="caption"
                        component="div"
                        color="text.secondary"
                    >{timer}s</Typography>
                </Box>

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

//https://stackoverflow.com/questions/57137094/implementing-a-countdown-timer-in-react-with-hooks
//https://mui.com/material-ui/react-dialog/
//https://mui.com/material-ui/react-progress/