import sound from "../../../assets/alarm1.mp3"

let alertCountdown;
const audio = new Audio(sound)

export const FireAlert = ({ alert }) => {

     alertCountdown = setTimeout(function () {

        console.log(alert.title)

        if(alert.sms){
            sendSMS()
        }

        if(alert.alarm){
            soundAlarm()
        }

        clearTimeout(alertCountdown);

        console.log("Alert Fired.......")
    }, 30000);

};

export const CancelAlert = ({ alert }) => {
    clearTimeout(alertCountdown);

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
