import Card from "@mui/material/Card";
import {CardHeader, IconButton} from "@mui/material";
import {Close} from "@material-ui/icons";
import {deleteAlertHistory} from "../../../model/db/DB";

export default function AlertHistoryCard({alertHistory, onDelete}) {
    function handleDeletePressed() {
        deleteAlertHistory(alertHistory.alert.id, alertHistory.id).then(r => {
            onDelete(alertHistory.id)
        })
    }

    return (
        <Card className={"cards"}>
            <CardHeader
                title={alertHistory.id}
                action={
                    <IconButton onClick={handleDeletePressed}>
                        <Close/>
                    </IconButton>
                }
            />
        </Card>
    )
}