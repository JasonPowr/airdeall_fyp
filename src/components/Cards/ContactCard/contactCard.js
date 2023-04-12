import Card from "@mui/material/Card";
import "./contactCard.css"
import {CardHeader, Typography} from "@mui/material";

export default function ContactCard({contact}) {
    return (
        <Card className={"contactCard"}>
            <CardHeader title={
                <Typography fontSize={15}>{contact.name}</Typography>
            }
                        subheader={
                            <Typography fontSize={15}>{contact.phone}</Typography>
                        }
            />
        </Card>
    )

}