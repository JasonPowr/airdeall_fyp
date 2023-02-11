import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import {CardContent, CardHeader} from "@mui/material";
import "./AlertCard.css"
import {CancelAlert, FireAlert} from "../../pages/Alerts/alertBehaviour/activateAlert";

export default function AlertCard( {alert} ) {
    let counter;
    function handleActivateClick() {
       FireAlert({alert})

       const end = Date.now() + 30000;
       counter = setInterval(function () {
           const timeLeft = Math.floor((end - Date.now()) / 1000);
           const timeCard = document.getElementById('timeLeftCard');

           if (timeLeft >= 0) {
               timeCard.innerHTML = `${timeLeft}`;
           }else{
               timeCard.innerHTML = "Alert Firing.....";
           }
        }, 1000);

    }

    function handleCancelClick() {
        CancelAlert( {alert} )
        clearInterval(counter);

        const timeCard = document.getElementById('timeLeftCard');
        timeCard.innerHTML = " ";
    }

    return (
        <Card className={"cards"}>
            <CardHeader
                title={alert.title}
                subheader={alert.description}
            />
            <CardContent>
                <p id={"timeLeftCard"}></p>
            </CardContent>
            <CardContent>
                <Button type={"button"} onClick={handleActivateClick} size="Medium">Activate</Button>
                <Button type={"button"} onClick={handleCancelClick} size="Medium">Cancel</Button>
            </CardContent>
        </Card>
    )
}