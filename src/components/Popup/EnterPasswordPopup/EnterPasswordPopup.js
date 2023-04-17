import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import {useFormik} from "formik";

export default function EnterPasswordPopup({openPasswordDialog, setOpenPasswordDialog, handleReturnedPassword}) {

    const handleClose = () => {
        setOpenPasswordDialog(false);
    };

    function handleSubmit() {
        handleReturnedPassword(values.password)
    }

    const {values, handleChange} = useFormik({
        initialValues: {
            password: ""
        }
    })

    return (
        <div>
            <Dialog open={openPasswordDialog} onClose={handleClose}>
                <DialogContent>
                    <DialogContentText>
                        Please confirm your password to continue
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password"
                        label="Enter Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        onChange={handleChange}
                        value={values.password}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

//https://mui.com/material-ui/react-dialog/