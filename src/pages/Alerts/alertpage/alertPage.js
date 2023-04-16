import React, {useEffect, useState} from "react";
import "./alertPage.css"
import {requestCameraAccess} from "../../../components/Camera/camera";
import {requestLocationPermission} from "../../../components/Maps/maps";
import BottomNav from "../../../components/bottomNav/bottomNav";
import Alerts from "../../../components/Alerts/Alerts";
import {auth} from "../../../firebase";
import {
    getCameraPermissions,
    getGeoLocationPermissions,
    getMicPermissions
} from "../../../components/Permissions/Permissions";

function AlertsPage() {
    const [geoLocationPermissionsGranted, setGeoLocationPermissionsGranted] = useState(false);
    const [cameraPermissionsGranted, setCameraPermissionsGranted] = useState(false);
    const [microphonePermissionsGranted, setMicrophonePermissionsGranted] = useState(false);

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
        <div>
            <Alerts/>
            <BottomNav value={0}/>
        </div>
    );
}

export default AlertsPage;