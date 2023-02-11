import sound from "../../../assets/alarm1.mp3"
import {toggleFlashlightOff, toggleFlashlightOn} from "../../../Helpers/Camera/cameraBehaviour";

let alertCountdown;
const audio = new Audio(sound)
let flashlightTrigger;

export const FireAlert = ({ alert }) => {

     alertCountdown = setTimeout(function () {

        console.log(alert.title)

        if(alert.sms){
            sendSMS()
        }

        if(alert.alarm){
            soundAlarm()
        }

        if(alert.flashlight){
            triggerFlashlight()
        }

        clearTimeout(alertCountdown);

        console.log("Alert Fired.......")
    }, 30000);

};

export const CancelAlert = ({ alert }) => {
    clearTimeout(alertCountdown);
    toggleFlashlightOff()

    if(alert.flashlight){
       clearInterval(flashlightTrigger)
    }

    if(alert.alarm){
        audio.pause()
    }

    console.log("Alert Cancelled")
}

const sendSMS = () => {
    console.log("Alert with SMS triggered")
}

const soundAlarm = () => {
    console.log("Alert with alarm triggered")
    audio.play().then(r => {})
}

export const triggerFlashlight = () => {
     flashlightTrigger = setInterval(function() {
        toggleFlashlightOn();
        setTimeout(toggleFlashlightOff, 250);
    }, 1000);
}
