import Card from "@mui/material/Card";
import {CardHeader, IconButton, Typography} from "@mui/material";
import {Close, ViewAgendaRounded} from "@material-ui/icons";
import {useLocation, useNavigate} from "react-router-dom";
import {deleteAlertHistory} from "../../../model/db/DB";

export default function AlertHistoryCard({alertHistory, onDelete}) {
    const location = useLocation();
    const alertId = location.state?.alertId;
    const navigate = useNavigate()

    function handleDeletePressed() {

        deleteAlertHistory(alertHistory.alert.id, alertHistory.id, alertHistory.alert.automaticRecording, alertHistory.alert.includeOnPublicMap, alertHistory.alert.sms.locationInfo).then(r => {
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
                title={
                    <Typography align={"left"}
                                fontSize={16}>{alertHistory.date + ' - ' + alertHistory.timeStart}</Typography>
                }
                action={
                    <div>
                        <IconButton onClick={handleInfoPressed}>
                            <ViewAgendaRounded fontSize={"small"}/>
                        </IconButton>

                        <IconButton onClick={handleDeletePressed}>
                            <Close fontSize={"small"}/>
                        </IconButton>
                    </div>
                }
            />
        </Card>
    )
}