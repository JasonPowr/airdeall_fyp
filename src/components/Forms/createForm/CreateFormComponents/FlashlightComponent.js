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


function FlashlightComponent({cameraPermissionsGranted, editAlert, handleChange}) {
    const classes = useStyles();

    return (
        <div>
            {cameraPermissionsGranted ? (
                <div className={classes.outer_sms}>
                    <p>Trigger Flashlight</p>

                    <Switch
                        onChange={handleChange}
                        id={"flashlight"}
                        defaultChecked={editAlert ? editAlert.flashlight : false}
                    />
                </div>) : (
                <div className={classes.outer_sms}>
                    <p>No Camera Access</p>
                    <Switch
                        onChange={handleChange}
                        id={"flashlight"}
                        disabled={true}
                        defaultChecked={editAlert ? editAlert.flashlight : false}
                    />
                </div>)}
        </div>
    );
}

export default FlashlightComponent