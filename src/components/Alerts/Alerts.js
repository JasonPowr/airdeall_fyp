import React, {useContext, useEffect, useRef, useState} from "react";
import {auth} from "../../firebase";
import {getUserAlertsFromDB} from "../../model/db/DB";
import {ListeningButton} from "../Buttons/ListeningButton/ListeningButton";
import {WarningPopUp} from "../Popup/WarningPopUp/WarningPopUp";
import AlertCard from "../Cards/AlertCard/AlertCard";
import {AlertDialog} from "../Popup/AlertPopUp/alertPopup";
import UserContext from "../../contexts/Auth/authContext";
import {HandleVoiceActivationOnLoad, stopTranscribing} from "../SpeechRecognition/SpeechRecognition";
import {makeStyles} from "@material-ui/core";
import {useNavigate} from "react-router-dom";
import {getStoredAlerts, setAlertsInStorage} from "../../model/local/localStorage";
import {AddAlert, AlarmOff} from "@material-ui/icons";

const useStyles = makeStyles({
    popUp_container: {
        alignContent: "center",
        alignItems: "center",
        margin: "auto",
        left: "0",
        right: "0",
    },
    noAlerts: {
        paddingTop: '100px',
    },
    listening: {
        position: 'fixed',
        bottom: '100px',
        right: '20px'
    },
    header: {
        paddingBottom: '25px',
    },
    add_alert: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
})

function Alerts() {
    const {user} = useContext(UserContext)
    const [alerts, setAlerts] = useState(null);
    const [activeAlert, setActiveAlert] = useState(null);

    const [isAlertActive, setIsAlertActive] = useState(false);
    const [isAlertInCountdown, setIsAlertInCountdown] = useState(false);

    const [isListening, setIsListening] = useState(false);
    const hasListenedOnLoad = sessionStorage.getItem('listenOnLoad');
    const transScriptTimeoutRef = useRef(null);

    const [emailVerified, setEmailVerified] = useState(null);
    const [phoneVerified, setPhoneVerified] = useState(null);
    const navigate = useNavigate()
    const classes = useStyles();

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {

                if (getStoredAlerts()) {
                    const alerts = JSON.parse(getStoredAlerts());
                    setAlerts(alerts);
                } else {
                    getUserAlertsFromDB().then(alerts => {
                        setAlerts(alerts);
                        console.log("alerts")
                        setAlertsInStorage(alerts)
                    })
                }

                if (user.emailVerified) {
                    setEmailVerified(true);
                } else {
                    setEmailVerified(false);
                }

                if (user.phoneNumber !== null) {
                    setPhoneVerified(true);
                } else {
                    setPhoneVerified(false);
                }
            }
        })
    }, []);

    function listen(onLoad) {
        if (onLoad) {
            setIsListening(true)
            HandleVoiceActivationOnLoad(alerts, setIsAlertActive, setIsAlertInCountdown)
            transScriptTimeoutRef.current = setTimeout(() => {
                setIsListening(false)
                clearTimeout(transScriptTimeoutRef.current)
                stopTranscribing()
                sessionStorage.setItem('listenOnLoad', true);
            }, 10000)
        } else {
            setIsListening(true)
            HandleVoiceActivationOnLoad(alerts, setIsAlertActive, setIsAlertInCountdown)
            transScriptTimeoutRef.current = setTimeout(() => {
                setIsListening(false)
                clearTimeout(transScriptTimeoutRef.current)
                stopTranscribing()
            }, 10000)
        }
    }

    useEffect(() => {
        if (!hasListenedOnLoad && ((alerts !== null) && alerts.length > 0)) {
            listen(true);
        }

        if (isListening && hasListenedOnLoad) {
            listen(false);
        }

        if (!isListening && hasListenedOnLoad) {
            setIsListening(false)
            clearTimeout(transScriptTimeoutRef.current)
            stopTranscribing()
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

    function handleCreate() {
        navigate("/create_alert")
    }

    return (
        <div>
            {(alerts && (emailVerified !== null) && (phoneVerified !== null)) ? (
                <div>
                    <div className={classes.header}>
                        <h1><b><u>Your Alerts</u></b></h1>

                        <div className={classes.add_alert} onClick={handleCreate}>
                            <p>Create Alert</p>
                            <AddAlert fontSize={"large"} style={{color: "white"}}/>
                        </div>

                        <div className={classes.popUp_container}>

                            {(user && !emailVerified) &&
                                <WarningPopUp message={"Email is not verified"} onCloseClick={handleCloseEmailError}
                                              context={"email"}/>}

                            {(user && !phoneVerified) &&
                                <WarningPopUp message={"Phone is not verified"} onCloseClick={handleClosePhoneError}
                                              context={"phone"}/>}

                        </div>


                    </div>

                    {(isAlertActive || isAlertInCountdown) && (
                        <AlertDialog alert={activeAlert}
                                     isAlertActive={isAlertActive}
                                     setIsAlertActive={setIsAlertActive}
                                     isAlertInCountdown={isAlertInCountdown}
                                     setAlertInCountdown={setIsAlertInCountdown}/>
                    )}

                    {(alerts && (alerts.length > 0)) ? (
                        <div className={"alertContainer"}>
                            {alerts.map((index) =>
                                <AlertCard key={index.alert.id}
                                           alert={index.alert}
                                           isAlertActive={isAlertActive}
                                           setIsAlertActive={setIsAlertActive}
                                           setAlertInCountdown={setIsAlertInCountdown}/>)}
                        </div>
                    ) : (
                        <div className={classes.noAlerts}>
                            <AlarmOff fontSize={"large"}/>
                            <p>No Alerts Found</p>
                        </div>
                    )}

                    <div className={classes.listening}>
                        <ListeningButton
                            isListening={isListening}
                            setIsListening={setIsListening}/>
                    </div>

                </div>

            ) : (
                <div>
                    Loading....
                </div>
            )}
        </div>
    );
}

export default Alerts;