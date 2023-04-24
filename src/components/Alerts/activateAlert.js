import sound from "../../assets/sounds/alarm1.mp3"
import {startRecording, stopRecording, toggleFlashlightOff, toggleFlashlightOn} from "../Camera/camera";
import {getLocation} from "../Maps/maps";
import {auth, db} from "../../firebase";
import {deleteDoc, doc, GeoPoint, setDoc} from "firebase/firestore";
import {v4 as uuidv4} from "uuid";
import {createPost} from "../Socials/facebook/facebook";
import {addAlertHistory} from "../../model/db/DB";

let alertCountdown;
let flashlightTrigger;
let locationUpdates;
let history_locationUpdates = []
let timeStart;
let date;
const audio = new Audio(sound)

export const FireAlertWithCountdown = ({alert}) => {
    alert.isInCountdown = true
    alertCountdown = setTimeout(async function () {
        alert.isInCountdown = false
        setTime()
        history_locationUpdates = []
        if (alert.sms) {
            await configureSMS(alert.sms.message.body, alert.sms.contacts.contact_1, alert.sms.contacts.contact_2, alert.sms.contacts.contact_3, alert.sms.locationInfo, alert.sms.recurringLocationInfo, alert.sms.proximitySMS)
        }

        if (alert.alarm) {
            soundAlarm()
        }

        if (alert.flashlight) {
            triggerFlashlight()
        }

        if (alert.includeOnPublicMap) {
            await includeOnPublicMap(alert)
        }

        if (alert.automaticRecording) {
            await recordAlert()
        }

        if (alert.socialMediaIntegration) {
            configureSocialMediaIntegration(alert.socialMediaIntegration.facebook.isEnabled, alert.socialMediaIntegration.facebook.isPostEnabled)
        }

        alert.isActive = true
        clearTimeout(alertCountdown);
    }, 30000);
};

export const FireAlertWithoutCountdown = ({alert}) => {
    history_locationUpdates = []
    setTime()
    if (alert.sms) {
        configureSMS(alert.sms.message.body, alert.sms.contacts.contact_1, alert.sms.contacts.contact_2, alert.sms.contacts.contact_3, alert.sms.locationInfo, alert.sms.recurringLocationInfo, alert.sms.proximitySMS)
    }
    if (alert.alarm) {
        soundAlarm()
    }
    if (alert.flashlight) {
        triggerFlashlight()
    }
    if (alert.includeOnPublicMap) {
        includeOnPublicMap(alert)
    }
    if (alert.automaticRecording) {
        recordAlert()
    }
    if (alert.socialMediaIntegration) {
        configureSocialMediaIntegration(alert.socialMediaIntegration.facebook.isEnabled, alert.socialMediaIntegration.facebook.isPostEnabled)
    }
    alert.isActive = true
};

export const CancelAlert = ({alert}) => {
    if (alert.isInCountdown) {
        clearTimeout(alertCountdown);
    } else {

        alert.isInCountdown = false
        clearTimeout(locationUpdates)

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
        if (alert.automaticRecording) {
            cancelRecording(alertHistoryId)
        }

        const end = new Date();
        let timeEnd = end.getHours() + ":" + end.getMinutes() + ":" + end.getSeconds();
        addAlertHistory(alert.id, generateAlertHistory(alert, alertHistoryId, history_locationUpdates, timeEnd)).then(r => {
            history_locationUpdates = null
            timeStart = null
            timeEnd = null
        })
        alert.isActive = false
    }
}

const validateNumber = (phoneNumber) => {
    let validatedPhoneNumber;
    validatedPhoneNumber = phoneNumber.replace(/\s/g, '');
    if (validatedPhoneNumber.charAt(0) === '0') {
        validatedPhoneNumber = validatedPhoneNumber.replace('0', '+353')
    }
    return validatedPhoneNumber
}

const sendSMS = async (messageBody, contact_1, contact_2, contact_3) => {
    if (contact_1 !== false) {
        const contact1 = await validateNumber(contact_1.phone);
        const url = process.env.REACT_APP_FIREBASE_FUNCTION_SEND_SMS_CONTACT_1 + `${messageBody}&variable2=${contact1}`;
        const requestOptions = {
            method: 'GET',
            mode: 'no-cors'
        };
        fetch(url, requestOptions)
            .catch(error => console.error(error));
    }

    if (contact_2 !== false) {
        const contact2 = await validateNumber(contact_2.phone);
        const url = process.env.REACT_APP_FIREBASE_FUNCTION_SEND_SMS_CONTACT_2 + `${messageBody}&variable2=${contact2}`;
        const requestOptions = {
            method: 'GET',
            mode: 'no-cors'
        };
        fetch(url, requestOptions)
            .catch(error => console.error(error));
    }

    if (contact_3 !== false) {
        const contact3 = await validateNumber(contact_3.phone);
        const url = process.env.REACT_APP_FIREBASE_FUNCTION_SEND_SMS_CONTACT_3 + `${messageBody}&variable2=${contact3}`;
        const requestOptions = {
            method: 'GET',
            mode: 'no-cors'
        };
        fetch(url, requestOptions)
            .catch(error => console.error(error));
    }
}
const configureSMS = async (messageBody, contact_1, contact_2, contact_3, locationInfo, recurringLocationInfo, proximitySMS) => {

    if (messageBody === "") {
        messageBody = "An alert has been Activated from Airdeall"
    }

    if (locationInfo) {
        const location = await getLocation()
        history_locationUpdates.push(location)
        messageBody = messageBody + ` Alert Fired at this location: 
        https://maps.google.com/?q=${location.lat},${location.lng}`
    }

    await sendSMS(messageBody, contact_1, contact_2, contact_3)

    if (proximitySMS) {
        const userLocation = await getLocation()
        const userLocationGeoPoint = new GeoPoint(userLocation.lat, userLocation.lng)

        const url = process.env.REACT_APP_FIREBASE_FUNCTION_SEND_PROXIMITY_ALERT +
            `${userLocationGeoPoint.latitude}&variable2=${userLocationGeoPoint.longitude}&variable3=2000`;
        const requestOptions = {
            method: 'GET',
            mode: 'no-cors'
        };
        fetch(url, requestOptions)
            .catch(error => console.error(error));
    }

    if (recurringLocationInfo) {
        locationUpdates = setInterval(async function () {
            const location = await getLocation()
            history_locationUpdates.push(location)
            messageBody = ` Location Update: https://maps.google.com/?q=${location.lat},${location.lng}`
            await sendSMS(messageBody, contact_1, contact_2, contact_3)
        }, 30000);
    }

}

const soundAlarm = async () => {
    audio.loop = true;
    audio.volume = 1
    await audio.play();
}

export const triggerFlashlight = () => {
    flashlightTrigger = setInterval(function () {
        toggleFlashlightOn();
        setTimeout(toggleFlashlightOff, 250);
    }, 1000);
}

const includeOnPublicMap = async () => {
    const location = await getLocation()
    history_locationUpdates.push(location)
    const alertRef = doc(db, "activeAlerts", auth.currentUser.uid);
    await setDoc(alertRef, {location}, {merge: true});
}


function recordAlert() {
    startRecording()
}

function cancelRecording(alertId) {
    stopRecording(alertId)
}

function configureSocialMediaIntegration(facebookIsEnabled, facebookIsPostEnabled) {
    if (facebookIsEnabled) {
        if (facebookIsPostEnabled) {
            createPost()
        }
    }
}

function generateIdFoHistory() {
    return uuidv4()
}

function setTime() {
    const today = new Date();
    date = (today.getDate()) + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    timeStart = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
}

function generateAlertHistory(alert, alertHistoryId, locationUpdates, timeEnd) {
    return {
        timeStart: timeStart,
        timeEnd: timeEnd,
        date: date,
        id: alertHistoryId,
        alert: alert,
        locationInfo: locationUpdates,
    }
}

//https://tecadmin.net/get-current-date-time-javascript/
