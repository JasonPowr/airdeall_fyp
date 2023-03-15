import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import {CardContent, CardHeader, IconButton} from "@mui/material";
import "./AlertCard.css"
import {CancelAlert, FireAlertWithCountdown, FireAlertWithoutCountdown} from "../Alerts/activateAlert";
import {Settings} from "@material-ui/icons";

export default function AlertCard({alert}) {
    let counter;

    function handleActivateClick() {
        FireAlertWithCountdown({alert})

        const end = Date.now() + 30000;
        counter = setInterval(function () {
            const timeLeft = Math.floor((end - Date.now()) / 1000);
            const timeCard = document.getElementById('timeLeftCard');

            if (timeLeft >= 0) {
                timeCard.innerHTML = `${timeLeft}`;
            } else {
                timeCard.innerHTML = "Alert Firing.....";
            }
        }, 1000);
    }

    function handleCancelClick() {
        CancelAlert({alert})
        clearInterval(counter);

        const timeCard = document.getElementById('timeLeftCard');
        timeCard.innerHTML = " ";
    }

    function handleActivateNowClick() {
        FireAlertWithoutCountdown({alert})
    }

    function handleInfoClickButton() {
        console.log("Hello")
    }

    return (
        <Card className={"cards"}>
            <CardHeader
                title={alert.title}
                subheader={alert.description}
                action={
                    <IconButton onClick={handleInfoClickButton}>
                        <Settings/>
                    </IconButton>
                }
            />

            <CardContent>
                <p id={"timeLeftCard"}></p>
            </CardContent>

            <CardContent>
                <Button type={"button"} onClick={handleActivateNowClick} size="Medium">Activate Now</Button>
                <Button type={"button"} onClick={handleActivateClick} size="Medium">Activate</Button>
                <Button type={"button"} onClick={handleCancelClick} size="Medium">Cancel</Button>
            </CardContent>
        </Card>
    )
}