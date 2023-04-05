import {Link} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {Button} from "@material-ui/core";
import "./alertPage.css"
import BottomNav from "../../../components/bottomNav/bottomNav";
import {requestCameraAccess} from "../../../components/Camera/camera";
import {requestLocationPermission} from "../../../components/Maps/maps";
import {getUserAlertsFromDB} from "../../../model/db/DB";
import AlertCard from "../../../components/Cards/AlertCard/AlertCard";
import {auth} from "../../../firebase";
import {WarningPopUp} from "../../../components/Popup/WarningPopUp/WarningPopUp";
import {AlertDialog} from "../../../components/Popup/AlertPopUp/alertPopup";
import {ListeningButton} from "../../../components/Buttons/ListeningButton/ListeningButton";
import {HandleVoiceActivationOnLoad, stopTranscribing} from "../../../components/SpeechRecognition/SpeechRecognition";

function AlertsPage() {
    const [alerts, setAlerts] = useState([]);
    const [activeAlert, setActiveAlert] = useState(null);
    const [isAlertActive, setIsAlertActive] = useState(false);
    const [isAlertInCountdown, setIsAlertInCountdown] = useState(false);
    const [isListening, setIsListening] = useState(true);

    const [emailVerified, setEmailVerified] = useState(false);
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [currentUser, setCurrentUser] = useState(false);

    const transScriptTimeoutRef = useRef(null);

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
            if (isListening) {
                HandleVoiceActivationOnLoad(alerts, setIsAlertActive, setIsAlertInCountdown)
                transScriptTimeoutRef.current = setTimeout(() => {
                    stopTranscribing()
                    setIsListening(false)
                }, 10000)
            }

            if (!isListening) {
                stopTranscribing()
                clearTimeout(transScriptTimeoutRef.current);
            }
        }
    }, [alerts, isListening]);

    useEffect(() => {
        if (isAlertActive || isAlertInCountdown) {
            alerts.map((index) => {
                if (index.alert.isActive || index.alert.isInCountdown) {
                    setActiveAlert(index.alert)
                }
            })
        }
    }, [alerts, isAlertActive, isAlertInCountdown]);

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

                    <ListeningButton
                        isListening={isListening}
                        setIsListening={setIsListening}/>

                    <div>
                        {(currentUser && !emailVerified) &&
                            <WarningPopUp message={"Email is not verified"} onCloseClick={handleCloseEmailError}
                                          context={"email"}/>}

                        {(currentUser && !phoneVerified) &&
                            <WarningPopUp message={"Phone is not verified"} onCloseClick={handleClosePhoneError}
                                          context={"phone"}/>}
                    </div>

                    {(isAlertActive || isAlertInCountdown) && (
                        <AlertDialog alert={activeAlert}
                                     isAlertActive={isAlertActive}
                                     setIsAlertActive={setIsAlertActive}
                                     isAlertInCountdown={isAlertInCountdown}
                                     setAlertInCountdown={setIsAlertInCountdown}/>
                    )}

                    <div className={"alertContainer"}>
                        {alerts.map((index) =>
                            <AlertCard key={index.alert.id}
                                       alert={index.alert}
                                       isAlertActive={isAlertActive}
                                       setIsAlertActive={setIsAlertActive}
                                       setAlertInCountdown={setIsAlertInCountdown}/>)}
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