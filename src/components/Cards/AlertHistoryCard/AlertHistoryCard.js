import Card from "@mui/material/Card";
import {CardHeader, IconButton, Typography} from "@mui/material";
import {Close, ViewAgendaRounded} from "@material-ui/icons";
import {useNavigate} from "react-router-dom";
import {deleteAlertHistory} from "../../../model/db/DB";
import {useState} from "react";
import ConfirmationPopup from "../../Popup/DeleteConfirmationPopup/ConfirmationPopup";

export default function AlertHistoryCard({alertHistory, onDelete}) {
    const navigate = useNavigate()
    const [openConfirmDeleteAlertHistory, setOpenConfirmDeleteAlertHistory] = useState(false);

    function handleDeletePressed() {
        setOpenConfirmDeleteAlertHistory(true)
    }

    function handleDeletePressedAfterConf(confirmation) {
        if (confirmation) {
            deleteAlertHistory(alertHistory.alert.id, alertHistory.id, alertHistory.alert.automaticRecording, alertHistory.alert.includeOnPublicMap, alertHistory.alert.sms.locationInfo).then(r => {
                onDelete(alertHistory.id)
            })
        }
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
        <div>
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

            {openConfirmDeleteAlertHistory && (
                <ConfirmationPopup openConfirmationDialog={openConfirmDeleteAlertHistory}
                                   setOpenConfirmationDialog={setOpenConfirmDeleteAlertHistory}
                                   handleConfirmation={handleDeletePressedAfterConf}
                                   context={"delete this history"}/>
            )}

        </div>
    )
}