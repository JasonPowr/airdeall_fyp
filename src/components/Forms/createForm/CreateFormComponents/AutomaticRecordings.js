import React from 'react';
import {Switch} from "@mui/material";
import {makeStyles} from "@material-ui/core";


const useStyles = makeStyles({
    outer_sms: {
        display: "flex",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "space-between"
    },
})

function AutomaticRecordings({
                                 cameraPermissionsGranted,
                                 microphonePermissionsGranted,
                                 handleChange,
                                 editAlert,
                                 values
                             }) {
    const classes = useStyles();
    return (
        <div>
            {cameraPermissionsGranted && microphonePermissionsGranted ? (
                <div className={classes.outer_sms}>
                    <p>Automatic recording</p>
                    <Switch
                        onChange={handleChange}
                        id={"automaticRecording"}
                        defaultChecked={editAlert ? editAlert.automaticRecording : false}
                    />
                </div>
            ) : (
                <div className={classes.outer_sms}>
                    <p>No Camera Access</p>
                    <Switch
                        onChange={handleChange}
                        id={"automaticRecording"}
                        disabled={true}
                        defaultChecked={editAlert ? editAlert.automaticRecording : false}
                    />
                </div>
            )}
        </div>
    );
};

export default AutomaticRecordings;