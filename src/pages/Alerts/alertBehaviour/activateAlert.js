

export const FireAlert = ({ alert }) => {

    const end = Date.now() + 30000;
    const counter = setInterval(function () {
        const timeLeft = Math.floor((end - Date.now()) / 1000);
        console.log(timeLeft + " seconds left");
    }, 1000);

    const alertCountdown = setTimeout(function () {

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

export const sendSMS = () => {
    console.log("Alert with SMS triggered")
}

export const soundAlarm = () => {
    console.log("Alert with alarm triggered")
}
