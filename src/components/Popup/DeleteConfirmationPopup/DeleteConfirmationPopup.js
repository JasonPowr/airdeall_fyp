import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import {IconButton} from "@mui/material";
import {Cancel, Delete} from "@material-ui/icons";

export default function DeleteConfirmationPopup({
                                                    openConfirmationDialog,
                                                    setOpenConfirmationDialog,
                                                    handleConfirmation
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
                <DialogTitle>Are you sure you want to delete?</DialogTitle>


                <DialogActions>
                    <IconButton size={"medium"} onClick={handleClose}>
                        <Cancel/>
                    </IconButton>

                    <IconButton size={"medium"} onClick={handleSubmit}>
                        <Delete/>
                    </IconButton>
                    
                </DialogActions>
            </Dialog>
        </div>
    );
}

//https://mui.com/material-ui/react-dialog/