import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import {Button} from "@material-ui/core";

export default function ConfirmationPopup({
                                              openConfirmationDialog,
                                              setOpenConfirmationDialog,
                                              handleConfirmation,
                                              context
                                          }) {

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
                <DialogTitle>Are you sure you want to {context}?</DialogTitle>


                <DialogActions>
                    <Button size={"medium"} onClick={handleClose}>No</Button>
                    <Button size={"medium"} onClick={handleSubmit}>Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

//https://mui.com/material-ui/react-dialog/