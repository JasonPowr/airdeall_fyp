import sound from "../../assets/sounds/alarm1.mp3"
import {startRecording, stopRecording, toggleFlashlightOff, toggleFlashlightOn} from "../Camera/camera";
import {getLocation} from "../Maps/maps";
import {auth, db} from "../../firebase";
import {deleteDoc, doc, GeoPoint, setDoc} from "firebase/firestore";
import {createPost} from "../Socials/facebook/facebook";
import {addAlertHistory} from "../../model/db/DB";
import {v4 as uuidv4} from "uuid";

let alertCountdown;
let flashlightTrigger;
let locationUpdates;
const audio = new Audio(sound)
export let isAlertActive = false
let history_locationUpdates = []

export const FireAlertWithCountdown = ({alert}) => {
    alertCountdown = setTimeout(function () {
        history_locationUpdates = []
        isAlertActive = true
        if (alert.sms) {
            configureSMS(alert.sms.message.body, alert.sms.contacts.contact_1.phone, alert.sms.contacts.contact_2.phone, alert.sms.contacts.contact_3.phone, alert.sms.locationInfo, alert.sms.recurringLocationInfo)
        }

        if (alert.alarm) {
            soundAlarm()
        }

        if (alert.flashlight) {
            triggerFlashlight()
        }

        if (alert.includeOnPublicMap) {
            includeOnPublicMap(alert.proximitySMS)
        }

        if (alert.automaticRecordings) {
            recordAlert()
        }

        if (alert.socialMediaIntegration) {
            configureSocialMediaIntegration()
        }

        clearTimeout(alertCountdown);
    }, 30000);
};

export const FireAlertWithoutCountdown = ({alert}) => {
    history_locationUpdates = []
    isAlertActive = true
    console.log(isAlertActive)
    if (alert.sms) {
        configureSMS(alert.sms.message.body, alert.sms.contacts.contact_1.phone, alert.sms.contacts.contact_2.phone, alert.sms.contacts.contact_3.phone, alert.sms.locationInfo, alert.sms.recurringLocationInfo)
    }
    if (alert.alarm) {
        soundAlarm()
    }
    if (alert.flashlight) {
        triggerFlashlight()
    }
    if (alert.includeOnPublicMap) {
        includeOnPublicMap(alert.proximitySMS)
    }
    if (alert.automaticRecordings) {
        recordAlert()
    }
    if (alert.socialMediaIntegration) {
        configureSocialMediaIntegration(alert.socialMediaIntegration.facebook.isEnabled, alert.socialMediaIntegration.facebook.isLinked, alert.socialMediaIntegration.facebook.isPostEnabled)
    }
};

export const CancelAlert = ({alert}) => {
    isAlertActive = false
    clearTimeout(alertCountdown);
    clearTimeout(locationUpdates)
    toggleFlashlightOff()
    const alertHistoryId = generateIdFoHistory()

    if (alert.flashlight) {
        clearInterval(flashlightTrigger)
    }

    if (alert.alarm) {
        audio.pause()
    }

    if (alert.includeOnPublicMap) {
        deleteDoc(doc(db, "activeAlerts", auth.currentUser.uid));
    }

    if (alert.automaticRecordings) {
        stopRecording(alertHistoryId)
    }

    addAlertHistory(alert.id, generateAlertHistory(alert, alertHistoryId, history_locationUpdates)).then(r => {
        history_locationUpdates = null
    })

}

const validateNumber = (phoneNumber) => {
    let validatedPhoneNumber = phoneNumber.replace(/\s/g, '');
    if (validatedPhoneNumber.charAt(0) === '0') {
        validatedPhoneNumber = validatedPhoneNumber.replace('0', '+353')
    }
    return validatedPhoneNumber
}

const sendSMS = async (messageBody, contact_1_phone, contact_2_phone, contact_3_phone) => {
    // if (contact_1_phone !== "") {
    //     const contact1 = await validateNumber(contact_1_phone);
    //     const url = process.env.REACT_APP_FIREBASE_FUNCTION_SEND_SMS_CONTACT_1 + `${messageBody}&variable2=${contact1}`;
    //     const requestOptions = {
    //         method: 'GET',
    //         mode: 'no-cors'
    //     };
    //     fetch(url, requestOptions)
    //         .catch(error => console.error(error));
    // }
    //
    // if (contact_2_phone !== "") {
    //     const contact2 = await validateNumber(contact_2_phone);
    //     const url = process.env.REACT_APP_FIREBASE_FUNCTION_SEND_SMS_CONTACT_2 + `${messageBody}&variable2=${contact2}`;
    //     const requestOptions = {
    //         method: 'GET',
    //         mode: 'no-cors'
    //     };
    //     fetch(url, requestOptions)
    //         .catch(error => console.error(error));
    // }
    //
    // if (contact_3_phone !== "") {
    //     const contact3 = await validateNumber(contact_3_phone);
    //     const url = process.env.REACT_APP_FIREBASE_FUNCTION_SEND_SMS_CONTACT_3 + `${messageBody}&variable2=${contact3}`;
    //     const requestOptions = {
    //         method: 'GET',
    //         mode: 'no-cors'
    //     };
    //     fetch(url, requestOptions)
    //         .catch(error => console.error(error));
    // }
}
const configureSMS = async (messageBody, contact_1_phone, contact_2_phone, contact_3_phone, locationInfo, recurringLocationInfo) => {

    if (messageBody === "") {
        messageBody = "Default Alert Message"
    }

    if (locationInfo) {
        const location = await getLocation()
        history_locationUpdates.push(location)
        messageBody = messageBody + ` Alert Fired at this location: https://maps.google.com/?q=${location.lat},${location.lng}`
    }

    await sendSMS(messageBody, contact_1_phone,
        contact_2_phone, contact_3_phone)

    if (recurringLocationInfo) {
        locationUpdates = setInterval(async function () {
            const location = await getLocation()
            history_locationUpdates.push(location)
            // messageBody = ` Location Update: https://maps.google.com/?q=${location.lat},${location.lng}`
            // await sendSMS(messageBody, contact_1_phone, contact_2_phone, contact_3_phone)
        }, 30000);
    }

}

const soundAlarm = () => {
    audio.play().then(r => {
    })
}

export const triggerFlashlight = () => {
    flashlightTrigger = setInterval(function () {
        toggleFlashlightOn();
        setTimeout(toggleFlashlightOff, 250);
    }, 1000);
}

const includeOnPublicMap = async (proximitySMS) => {
    const userLocation = await getLocation()
    const userLocationGeoPoint = new GeoPoint(userLocation.lat, userLocation.lng)

    const location = {
        alertUID: auth.currentUser.uid,
        alertLocation: userLocationGeoPoint
    };

    const alertRef = doc(db, "activeAlerts", auth.currentUser.uid);
    await setDoc(alertRef, {location}, {merge: true});

    if (proximitySMS) {
        const url = process.env.REACT_APP_FIREBASE_FUNCTION_SEND_PROXIMITY_ALERT +
            `${userLocationGeoPoint.latitude}&variable2=${userLocationGeoPoint.longitude}&variable3=2000`;
        const requestOptions = {
            method: 'GET',
            mode: 'no-cors'
        };
        fetch(url, requestOptions)
            .catch(error => console.error(error));
    }
}

function recordAlert() {
    startRecording()
}

function configureSocialMediaIntegration(facebookIsEnabled, facebookIsLinked, facebookIsPostEnabled) {
    if (facebookIsLinked && facebookIsEnabled) {
        if (facebookIsPostEnabled) {
            createPost()
        }
    }
}

function generateIdFoHistory() {
    return uuidv4()
}

function generateAlertHistory(alert, alertHistoryId, locationUpdates) {
    return {
        id: alertHistoryId,
        alert: alert,
        locationInfo: locationUpdates,
    }
}
