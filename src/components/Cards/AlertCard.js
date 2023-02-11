import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import {CardContent, CardHeader} from "@mui/material";
import "./AlertCard.css"
import {FireAlert} from "../../pages/Alerts/alertBehaviour/activateAlert";

export default function AlertCard( {alert} ) {

    function handleActivateClick() {
        FireAlert({alert})
    }

    return (
        <Card className={"cards"}>
            <CardHeader
                title={alert.title}
                subheader={alert.description}
            />
            <CardContent>
                <Button type={"button"} onClick={handleActivateClick} size="Medium">Activate</Button>
            </CardContent>
        </Card>
    )
}