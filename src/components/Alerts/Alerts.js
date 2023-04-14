import React, {useContext, useEffect, useRef, useState} from "react";
import {auth} from "../../firebase";
import {getUserAlertsFromDB} from "../../model/db/DB";
import {ListeningButton} from "../Buttons/ListeningButton/ListeningButton";
import {WarningPopUp} from "../Popup/WarningPopUp/WarningPopUp";
import AlertCard from "../Cards/AlertCard/AlertCard";
import {AlertDialog} from "../Popup/AlertPopUp/alertPopup";
import UserContext from "../../contexts/Auth/authContext";
import {HandleVoiceActivationOnLoad, stopTranscribing} from "../SpeechRecognition/SpeechRecognition";
import {Button} from "@material-ui/core";
import {Link} from "react-router-dom";

function Alerts() {
    const {user} = useContext(UserContext)
    const [alerts, setAlerts] = useState([]);
    const [activeAlert, setActiveAlert] = useState(null);
    const [isAlertActive, setIsAlertActive] = useState(false);
    const [isAlertInCountdown, setIsAlertInCountdown] = useState(false);
    const [isListening, setIsListening] = useState(true);
    const [emailVerified, setEmailVerified] = useState(false);
    const [phoneVerified, setPhoneVerified] = useState(false);
    const transScriptTimeoutRef = useRef(null);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
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
        const hasListenedOnLoad = sessionStorage.getItem('listenOnLoad');
        if (alerts.length > 0) {
            if (isListening && hasListenedOnLoad) {
                HandleVoiceActivationOnLoad(alerts, setIsAlertActive, setIsAlertInCountdown)
                transScriptTimeoutRef.current = setTimeout(() => {
                    setIsListening(false)
                    clearTimeout(transScriptTimeoutRef.current)
                    stopTranscribing()
                }, 10000)
            } else {
                clearTimeout(transScriptTimeoutRef.current)
                stopTranscribing()
            }
        }
    }, [alerts, isListening]);

    useEffect(() => {
        if (alerts.length === 0) {
            setIsListening(false)
        }
    }, [alerts]);


    useEffect(() => {
        const hasListenedOnLoad = sessionStorage.getItem('listenOnLoad');
        if (!hasListenedOnLoad && (alerts.length > 0)) {
            listenOnLoad();
        }
    }, [alerts, isListening]);


    function listenOnLoad() {
        if (isListening) {
            HandleVoiceActivationOnLoad(alerts, setIsAlertActive, setIsAlertInCountdown)
            transScriptTimeoutRef.current = setTimeout(() => {
                setIsListening(false)
                sessionStorage.setItem('listenOnLoad', true);
                clearTimeout(transScriptTimeoutRef.current)
                stopTranscribing()
            }, 10000)
        } else {
            clearTimeout(transScriptTimeoutRef.current)
            stopTranscribing()
        }
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

    return (
        <div>
            <div>
                <ListeningButton
                    isListening={isListening}
                    setIsListening={setIsListening}/>

                <Link to={"/create_alert"}><Button>Create Alert</Button></Link>
            </div>

            <div>
                {(user && !emailVerified) &&
                    <WarningPopUp message={"Email is not verified"} onCloseClick={handleCloseEmailError}
                                  context={"email"}/>}

                {(user && !phoneVerified) &&
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
        </div>
    );
}

export default Alerts;