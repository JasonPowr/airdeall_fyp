import Card from '@mui/material/Card';
import {CardContent, CardHeader, IconButton} from "@mui/material";
import "./AlertCard.css"
import {Settings, VolumeUp} from "@material-ui/icons";
import {useNavigate} from "react-router-dom";
import {Button} from "@material-ui/core";
import {FireAlertWithCountdown, FireAlertWithoutCountdown} from "../../Alerts/activateAlert";

export default function AlertCard({alert, isAlertActive, setIsAlertActive, setAlertInCountdown}) {
    const navigate = useNavigate()

    function handleInfoClickButton() {
        navigate(`/${alert.id}/alert_view`, {state: {alertId: alert.id}});
    }

    function handleDisplayActivationPhrase() {
        console.log(alert.voiceActivation.voiceActivationPhrase)
    }

    function handleActivateNowClick() {
        if (!isAlertActive) {
            try {
                FireAlertWithoutCountdown({alert});
            } catch (error) {
                console.log(error)
            }
            setIsAlertActive(true)
        } else {
            console.log("Alert is already Active")
        }
    }

    function handleActivateClick() {
        if (!isAlertActive) {
            try {
                FireAlertWithCountdown({alert});
            } catch (error) {
                console.log(error)
            }
            setIsAlertActive(true)
            setAlertInCountdown(true)
        } else {
            console.log("Alert is already Active")
        }
    }


    return (
        <Card className={"cards"}>
            <CardHeader
                title={alert.title}
                action={
                    <div>
                        <IconButton onClick={handleInfoClickButton}>
                            <Settings/>
                        </IconButton>

                        {alert.voiceActivation.isEnabled && (
                            <div>
                                <IconButton onClick={handleDisplayActivationPhrase}>
                                    <VolumeUp/>
                                </IconButton>
                            </div>
                        )}
                    </div>
                }
            />
            <CardContent>
                <Button type={"button"} onClick={handleActivateNowClick} size="medium">Activate Now</Button>
                <Button type={"button"} onClick={handleActivateClick} size="medium">Activate</Button>
            </CardContent>
        </Card>
    )
}