import Card from '@mui/material/Card';
import {CardContent, CardHeader, IconButton} from "@mui/material";
import "./AlertCard.css"
import {Settings, VolumeUp} from "@material-ui/icons";
import {useNavigate} from "react-router-dom";
import {AlertDialog} from "../../Popup/AlertPopUp/alertPopup";

export default function AlertCard({alert}) {
    const navigate = useNavigate()

    function handleInfoClickButton() {
        navigate(`/${alert.id}/alert_view`, {state: {alertId: alert.id}});
    }

    function handleDisplayActivationPhrase() {
        console.log(alert.voiceActivation.voiceActivationPhrase)
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
                <AlertDialog alert={alert}/>
            </CardContent>
        </Card>
    )
}