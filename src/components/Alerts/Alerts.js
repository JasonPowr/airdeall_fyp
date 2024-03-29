import React, {useContext, useEffect, useRef, useState} from "react";
import {auth} from "../../firebase";
import {getUserAlertsFromDB} from "../../model/db/DB";
import {ListeningButton} from "../Buttons/ListeningButton/ListeningButton";
import {WarningPopUp} from "../Popup/WarningPopUp/WarningPopUp";
import AlertCard from "../Cards/AlertCard/AlertCard";
import {AlertDialog} from "../Popup/AlertPopUp/alertPopup";
import UserContext from "../../contexts/Auth/authContext";
import {HandleVoiceActivationOnLoad, stopTranscribing} from "../SpeechRecognition/SpeechRecognition";
import {Button, makeStyles} from "@material-ui/core";
import {useNavigate} from "react-router-dom";
import {getStoredAlerts, setAlertsInStorage} from "../../model/local/localStorage";
import {AddAlert, AlarmOff} from "@material-ui/icons";
import Loading from "../Loading/Loading";
import BottomNav from "../bottomNav/bottomNav";

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
    const [isVoiceActivatedAlert, setIsVoiceActivatedAlert] = useState(false);

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

    useEffect(() => {
        if (alerts) {

            alerts.map((index) => {
                if (index.alert.voiceActivation.isEnabled) {
                    setIsVoiceActivatedAlert(true)
                }
            })

            if ((hasListenedOnLoad === null) && isVoiceActivatedAlert) {
                listen()
            } else {
                setIsListening(false)
                stopTranscribing()
                clearTimeout(transScriptTimeoutRef.current)
            }

            if (isListening && isVoiceActivatedAlert && (hasListenedOnLoad === "true")) {
                listen()
            }
        }

    }, [hasListenedOnLoad, isListening, isVoiceActivatedAlert, alerts]);


    function listen() {
        setIsListening(true)
        HandleVoiceActivationOnLoad(alerts, setIsAlertActive, setIsAlertInCountdown)
        transScriptTimeoutRef.current = setTimeout(() => {
            sessionStorage.setItem('listenOnLoad', true);
            setIsListening(false)
            stopTranscribing()
            clearTimeout(transScriptTimeoutRef.current)
        }, 10000)
    }


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
                            <Button style={{color: "white"}}>
                                <p>Create Alert</p>
                                <AddAlert fontSize={"large"} style={{color: "white"}}/>
                            </Button>
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
                    <BottomNav value={0}/>
                </div>
            ) : (
                <Loading/>
            )}
        </div>
    );
}

export default Alerts;