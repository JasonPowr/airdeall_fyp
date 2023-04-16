import Card from "@mui/material/Card";
import "./contactCard.css"
import {CardHeader, Typography} from "@mui/material";

export default function ContactCard({contact}) {


    if (contact === false) {
        return (
            <Card className={"contactCard"}>
                <CardHeader title={
                    <Typography fontSize={15}>No Contact set</Typography>
                }
                />
            </Card>
        )
    } else {
        return (
            <Card className={"contactCard"}>
                <CardHeader title={
                    <Typography fontSize={15}>{contact.name}</Typography>
                }
                            subheader={
                                <Typography fontSize={15}>{contact.tel[0]}</Typography>
                            }
                />
            </Card>
        )
    }

}