import React from 'react';
import {createSpeechlySpeechRecognition} from '@speechly/speech-recognition-polyfill';
import {FireAlertWithCountdown, FireAlertWithoutCountdown} from "../Alerts/activateAlert";

const appId = process.env.REACT_APP_SPEECHLY_APP_ID;
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
export let speechRecognition;
let isTranscribing = false

export const startTranscribing = () => {
    if (SpeechlySpeechRecognition.hasBrowserSupport) {
        speechRecognition = new SpeechlySpeechRecognition();
        speechRecognition.start();
        isTranscribing = true
        console.log("start")

        return isTranscribing
    } else {
        window.alert("Not Supported")
    }
}

export const stopTranscribing = () => {
    console.log("stop")
    if (isTranscribing) {
        speechRecognition.stop();
    }
}

export function HandleVoiceActivationOnLoad(alerts, setIsAlertActive, setIsAlertInCountdown) {
    const alertsWithVoiceActivationEnabled = []
    if (alerts) {
        alerts.map((index) => {
            if (index.alert.voiceActivation.isEnabled) {
                alertsWithVoiceActivationEnabled.push(index.alert)
            }
        })
    }


    if (alertsWithVoiceActivationEnabled.length > 0) {
        startTranscribing();
        speechRecognition.onresult = ({results}) => {
            const transcript = results[0][0].transcript;

            alertsWithVoiceActivationEnabled.map((alert) => {
                if (transcript.toString().toLowerCase().replace(/[.,' \s]/g, '').includes(alert.voiceActivation.voiceActivationPhrase.toString().toLowerCase().replace(/[.,' \s]/g, ''))) {
                    if (alert.voiceActivation.voiceActivationForAlertWithoutCountDown) {
                        FireAlertWithoutCountdown({alert})
                        setIsAlertActive(true)
                    } else {
                        FireAlertWithCountdown({alert})
                        setIsAlertActive(true)
                        setIsAlertInCountdown(true)
                    }
                }
            })
        };
    }
}

//https://github.com/speechly/speech-recognition-polyfill#integrating-with-react-speech-recognition
//https://github.com/JamesBrill/react-speech-recognition/blob/HEAD/docs/POLYFILLS.md