import sound from "../../../assets/alarm1.mp3"

let alertCountdown;
let counter;
const audio = new Audio(sound)

export const FireAlert = ({ alert }) => {

    const end = Date.now() + 30000;
     counter = setInterval(function () {
        const timeLeft = Math.floor((end - Date.now()) / 1000);
        console.log(timeLeft + " seconds left");
    }, 1000);

     alertCountdown = setTimeout(function () {

        console.log(alert.title)

        if(alert.sms){
            sendSMS()
        }

        if(alert.alarm){
            soundAlarm()
        }

        clearTimeout(alertCountdown);
        clearInterval(counter);

        console.log("Alert Fired.......")
    }, 30000);

};

export const CancelAlert = ({ alert }) => {
    clearTimeout(alertCountdown);
    clearInterval(counter);

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
