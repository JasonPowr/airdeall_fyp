import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

export default function ConfirmationPopup({openConfirmationDialog, setOpenConfirmationDialog, handleConfirmation}) {

    const handleClose = () => {
        handleConfirmation(false)
        setOpenConfirmationDialog(false);
    };

    function handleSubmit() {
        handleConfirmation(true)
        setOpenConfirmationDialog(false);
    }

    return (
        <div>
            <Dialog open={openConfirmationDialog}>
                <DialogTitle>Are you sure you wish to Continue!</DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={handleSubmit}>Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

//https://mui.com/material-ui/react-dialog/