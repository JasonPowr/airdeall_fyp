import sound from "../../assets/sounds/alarm1.mp3"
import {toggleFlashlightOff, toggleFlashlightOn} from "../Camera/camera";
import {getLocation} from "../Maps/maps";

let alertCountdown;
const audio = new Audio(sound)
let flashlightTrigger;

export const FireAlertWithCountdown = ({alert}) => {

    alertCountdown = setTimeout(function () {

        console.log(alert.title)

        if (alert.sms) {
            sendSMS(alert.messageBody, alert.contact_1_phone, alert.contact_2_phone, alert.contact_3_phone, alert.locationInfo, alert.recurringLocationInfo)
        }

        if (alert.alarm) {
            soundAlarm()
        }

        if (alert.flashlight) {
            triggerFlashlight()
        }

        clearTimeout(alertCountdown);

        console.log("Alert Fired.......")
    }, 30000);
};

export const FireAlertWithoutCountdown = ({alert}) => {

    if (alert.sms) {
        sendSMS(alert.messageBody, alert.contact_1_phone, alert.contact_2_phone, alert.contact_3_phone, alert.locationInfo, alert.recurringLocationInfo)
    }

    if (alert.alarm) {
        soundAlarm()
    }

    if (alert.flashlight) {
        triggerFlashlight()
    }

};

export const CancelAlert = ({alert}) => {
    clearTimeout(alertCountdown);
    toggleFlashlightOff()

    if (alert.flashlight) {
        clearInterval(flashlightTrigger)
    }

    if (alert.alarm) {
        audio.pause()
    }

    console.log("Alert Cancelled")
}

const validateNumber = (phoneNumber) => {
    let validatedPhoneNumber = phoneNumber.replace(/\s/g, '');
    if (validatedPhoneNumber.charAt(0) === '0') {
        validatedPhoneNumber = validatedPhoneNumber.replace('0', '+353')
    }
    return validatedPhoneNumber
}
const sendSMS = async (messageBody, contact_1_phone, contact_2_phone, contact_3_phone, locationInfo, reccuringLocationInfo) => {

    if (messageBody === "") {
        messageBody = "Default Alert Message"
    }

    if (locationInfo) {
        const location = await getLocation()
        messageBody = messageBody + ` Alert Fired at this location: https://maps.google.com/?q=${location.lat},${location.lng}`
    }

    if (contact_1_phone !== "") {
        const contact1 = await validateNumber(contact_1_phone);
        fetch(process.env.REACT_APP_FIREBASE_FUNCTION_SEND_SMS_CONTACT_1 + `${messageBody}&variable2=${contact1}`)
            .catch(err => console.error(err))
    }

    if (contact_2_phone !== "") {
        const contact2 = await validateNumber(contact_2_phone);
        fetch(process.env.REACT_APP_FIREBASE_FUNCTION_SEND_SMS_CONTACT_2 + `${messageBody}&variable2=${contact2}`)
            .catch(err => console.error(err))
    }

    if (contact_3_phone !== "") {
        const contact3 = await validateNumber(contact_3_phone);
        fetch(process.env.REACT_APP_FIREBASE_FUNCTION_SEND_SMS_CONTACT_3 + `${messageBody}&variable2=${contact3}`)
            .catch(err => console.error(err))
    }
}

const soundAlarm = () => {
    console.log("Alert with alarm triggered")
    audio.play().then(r => {
    })
}

export const triggerFlashlight = () => {
    flashlightTrigger = setInterval(function () {
        toggleFlashlightOn();
        setTimeout(toggleFlashlightOff, 250);
    }, 1000);
}
