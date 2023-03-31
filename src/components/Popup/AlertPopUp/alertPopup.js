import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import {
    CancelAlert,
    FireAlertWithCountdown,
    FireAlertWithoutCountdown,
    isAlertActive
} from "../../Alerts/activateAlert";
import {DialogTitle} from "@mui/material";

export default function AlertDialog({alert}) {
    const [isOpen, setIsOpen] = React.useState(false);

    function handleActivateClick() {
        if (!isAlertActive) {
            FireAlertWithCountdown({alert})
            setIsOpen(true);
        }
    }

    function handleCancelClick() {
        if (isAlertActive) {
            CancelAlert({alert})
            setIsOpen(false);
        }
    }

    function handleActivateNowClick() {
        if (!isAlertActive) {
            FireAlertWithoutCountdown({alert})
            setIsOpen(true);
        }
    }

    return (
        <div>
            <div>
                <Button variant="outlined" onClick={handleActivateNowClick}>
                    Activate Now
                </Button>

                <Button variant="outlined" onClick={handleActivateClick}>
                    Activate
                </Button>
            </div>

            <Dialog
                open={isOpen}
            >
                <DialogTitle>
                    {"Alert Activated"}
                </DialogTitle>

                <DialogActions>
                    <Button onClick={handleCancelClick}>Cancel Alert</Button>
                </DialogActions>

            </Dialog>
        </div>
    );
}

//https://mui.com/material-ui/react-dialog/