import Card from "@mui/material/Card";
import {CardHeader, IconButton} from "@mui/material";
import {Close, ViewAgendaRounded} from "@material-ui/icons";
import {deleteAlertHistory} from "../../../model/db/DB";
import {useLocation, useNavigate} from "react-router-dom";

export default function AlertHistoryCard({alertHistory, onDelete}) {
    const location = useLocation();
    const alertId = location.state?.alertId;
    const navigate = useNavigate()

    function handleDeletePressed() {
        deleteAlertHistory(alertHistory.alert.id, alertHistory.id, alertHistory.alert.automaticRecording).then(r => {
            onDelete(alertHistory.id)
        })
    }

    function handleInfoPressed() {
        navigate(`/${alertHistory.alert.id}/alert_view/${alertHistory.id}/history_view`, {
            state: {
                alertId: alertHistory.alert.id,
                alertHistoryId: alertHistory.id
            }
        });
    }

    return (
        <Card className={"cards"}>
            <CardHeader
                title={alertHistory.id}
                action={
                    <div>
                        <IconButton onClick={handleInfoPressed}>
                            <ViewAgendaRounded/>
                        </IconButton>

                        <IconButton onClick={handleDeletePressed}>
                            <Close/>
                        </IconButton>
                    </div>
                }
            />
        </Card>
    )
}