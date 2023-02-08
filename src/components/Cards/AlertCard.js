import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import {CardContent, CardHeader} from "@mui/material";
import "./AlertCard.css"

export default function AlertCard(alert) {
    return (
        <Card className={"cards"}>
            <CardHeader
                title={alert.title}
                subheader={alert.description}
            />
            <CardContent>
                <Button className={"cardsBtn"} size="Medium">Activate</Button>
            </CardContent>
        </Card>
    )
}