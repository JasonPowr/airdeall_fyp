import Card from '@mui/material/Card';
import {CardContent, CardHeader, IconButton} from "@mui/material";
import "./AlertCard.css"
import {Settings} from "@material-ui/icons";
import AlertDialog from "../../Popup/AlertPopUp/alertPopup";
import {useNavigate} from "react-router-dom";

export default function AlertCard({alert}) {
    const navigate = useNavigate()

    function handleInfoClickButton() {
        navigate(`/${alert.id}/alert_view`, {state: {alertId: alert.id}});
    }

    return (
        <Card className={"cards"}>
            <CardHeader
                title={alert.title}
                action={
                    <IconButton onClick={handleInfoClickButton}>
                        <Settings/>
                    </IconButton>
                }
            />

            <CardContent>
                <AlertDialog alert={alert}/>
            </CardContent>
        </Card>
    )
}