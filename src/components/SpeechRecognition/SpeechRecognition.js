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
        console.log("transcribing")

        return isTranscribing
    } else {
        window.alert("Not Supported")
    }
}
export const stopTranscribing = () => {
    if (isTranscribing) {
        speechRecognition.stop();
        console.log("not transcribing")
    }
}

export function handleVoiceActivationOnLoad(alerts) {
    const alertsWithVoiceActivationEnabled = []
    alerts.map((index) => {
        if (index.alert.voiceActivation.isEnabled) {
            alertsWithVoiceActivationEnabled.push(index.alert)
        }
    })

    startTranscribing();
    speechRecognition.onresult = ({results}) => {
        const transcript = results[0][0].transcript;

        alertsWithVoiceActivationEnabled.map((alert) => {
            if (transcript.toString().toLowerCase().replace(/[.,' \s]/g, '').includes(alert.voiceActivation.voiceActivationPhrase.toString().toLowerCase().replace(/[.,' \s]/g, ''))) {
                if (alert.voiceActivation.voiceActivationForAlertWithoutCountDown) {
                    FireAlertWithoutCountdown({alert})
                } else {
                    FireAlertWithCountdown({alert})
                }
            }
        })
    };
    setTimeout(stopTranscribing, 10000);
}


//https://github.com/speechly/speech-recognition-polyfill#integrating-with-react-speech-recognition
//https://github.com/JamesBrill/react-speech-recognition/blob/HEAD/docs/POLYFILLS.md