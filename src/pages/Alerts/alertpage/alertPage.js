import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Button} from "@material-ui/core";
import "./alertPage.css"
import BottomNav from "../../../components/bottomNav/bottomNav";
import {requestCameraAccess} from "../../../components/Camera/camera";
import {requestLocationPermission} from "../../../components/Maps/maps";
import {getUserAlertsFromDB} from "../../../model/db/DB";
import AlertCard from "../../../components/Cards/AlertCard/AlertCard";
import {auth} from "../../../firebase";
import {WarningPopUp} from "../../../components/Popup/WarningPopUp/WarningPopUp";

function AlertsPage() {
    const [alerts, setAlerts] = useState([]);
    const [emailVerified, setEmailVerified] = useState(false);
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [currentUser, setCurrentUser] = useState(false);
    const [tab, setTab] = useState(0)

    requestCameraAccess()
    requestLocationPermission()

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setCurrentUser(user)
                getUserAlertsFromDB().then(alerts => {
                    setAlerts(alerts)
                })
                if (user.emailVerified) {
                    setEmailVerified(true)
                }
                if (user.phoneNumber !== null) {
                    setPhoneVerified(true)
                }
            }
        })
    }, []);

    useEffect(() => {
        if (alerts.length > 0) {
            // handleVoiceActivationOnLoad(alerts)
        }
    }, [currentUser, alerts]);

    const handleCloseEmailError = () => {
        setEmailVerified(false);
        return false
    };

    const handleClosePhoneError = () => {
        setPhoneVerified(false);
        return false
    };

    return (
        <div>
            {currentUser ? (
                <div>
                    <header>Your Alerts</header>

                    <div>
                        {(currentUser && !emailVerified) &&
                            <WarningPopUp message={"Email is not verified"} onCloseClick={handleCloseEmailError}
                                          context={"email"}/>}

                        {(currentUser && !phoneVerified) &&
                            <WarningPopUp message={"Phone is not verified"} onCloseClick={handleClosePhoneError}
                                          context={"phone"}/>}
                    </div>

                    <div className={"alertContainer"}>
                        {alerts.map((index) =>
                            <AlertCard key={index.alert.id} alert={index.alert}/>)}
                    </div>

                    <Link to={"/create_alert"}><Button>Create Alert</Button></Link>
                    <BottomNav value={tab} onChange={setTab}/>
                </div>

            ) : (
                <div>Loading .....</div>
            )}
        </div>
    );
}

export default AlertsPage;