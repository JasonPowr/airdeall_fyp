import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import {Box, CircularProgress, DialogTitle, Typography} from "@mui/material";
import {CancelAlert} from "../../Alerts/activateAlert";
import {makeStyles} from "@material-ui/core";
import {getClosestSafePoints} from "../../Maps/maps";
import SafePointCard from "../../Cards/SafePointCards/SafePointCards";

const useStyles = makeStyles({
    activeAlertPopup: {
        alignContent: "center",
        justifyContent: "center",
        textAlign: "center"
    },
})

export function AlertDialog({alert, isAlertActive, setIsAlertActive, isAlertInCountdown, setAlertInCountdown}) {
    let time = 0;
    let [timer, setTimer] = useState(0);
    let countdownTimer = useRef(null);
    let countdownTimeout = useRef(null);
    const [safePointsInProximityForCard, setSafePointsInProximityForCard] = useState(null)
    const classes = useStyles();

    useEffect(() => {

        if (isAlertActive) {
            getClosestSafePoints().then((resp) => {
                setSafePointsInProximityForCard(resp)
            })
        }

    }, [isAlertActive])

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
                className={classes.activeAlertPopup}
                open={isAlertInCountdown}
            >
                <DialogTitle>
                    {alert && alert.title} is in Countdown
                </DialogTitle>

                <Box>
                    <CircularProgress variant="determinate" value={(timer / 30) * 100}/>
                    <Typography
                        variant="caption"
                        component="div"
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
            <div>
                {safePointsInProximityForCard && (
                    <Dialog
                        className={classes.activeAlertPopup}
                        open={isAlertActive}>

                        <DialogTitle>
                            {alert && alert.title} is Active
                        </DialogTitle>

                        {(safePointsInProximityForCard.length > 0) && (
                            <Typography fontSize={15} paddingBottom={2}>
                                <b>Closest Safe Points</b>
                            </Typography>
                        )}

                        {safePointsInProximityForCard.map((safePoint, index) => (
                            <SafePointCard key={index} safePoint={safePoint}/>))}

                        <DialogActions>
                            <Button onClick={handleCancel}>Cancel Alert</Button>
                        </DialogActions>

                    </Dialog>
                )}
            </div>
        )
    }
}

//https://stackoverflow.com/questions/57137094/implementing-a-countdown-timer-in-react-with-hooks
//https://mui.com/material-ui/react-dialog/
//https://mui.com/material-ui/react-progress/