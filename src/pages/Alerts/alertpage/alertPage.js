import React, {useEffect, useState} from "react";
import "./alertPage.css"
import {requestCameraAccess} from "../../../components/Camera/camera";
import {requestLocationPermission} from "../../../components/Maps/maps";
import Alerts from "../../../components/Alerts/Alerts";
import {auth} from "../../../firebase";
import {
    getCameraPermissions,
    getGeoLocationPermissions,
    getMicPermissions
} from "../../../components/Permissions/Permissions";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
    container: {
        textAlign: 'center',
        display: 'block',
        fontFamily: "Raleway",
        height: '91.5%',
        overflow: 'auto',
    },
})

function AlertsPage() {
    const [geoLocationPermissionsGranted, setGeoLocationPermissionsGranted] = useState(false);
    const [cameraPermissionsGranted, setCameraPermissionsGranted] = useState(false);
    const [microphonePermissionsGranted, setMicrophonePermissionsGranted] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setGeoLocationPermissionsGranted(getGeoLocationPermissions())
                setCameraPermissionsGranted(getCameraPermissions())
                setMicrophonePermissionsGranted(getMicPermissions())
            }
        })
    }, []);

    if (!geoLocationPermissionsGranted || !cameraPermissionsGranted || !microphonePermissionsGranted) {
        requestCameraAccess()
        requestLocationPermission()
    }

    return (
        <div className={classes.container}>
            <Alerts/>
        </div>
    );
}

export default AlertsPage;