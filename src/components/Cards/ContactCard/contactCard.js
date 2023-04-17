import Card from "@mui/material/Card";
import {CardHeader, Typography} from "@mui/material";
import {makeStyles} from "@material-ui/core";


const useStyles = makeStyles({
    contactCard: {
        width: "80%",
        maxWidth: "200px",
        textAlign: "left",
        margin: "20px auto",
    },
})

export default function ContactCard({contact}) {
    const classes = useStyles();

    if (contact === false) {
        return (
            <Card className={classes.contactCard}>
                <CardHeader title={
                    <Typography fontSize={15}>No Contact set</Typography>
                }
                />
            </Card>
        )
    } else {
        return (
            <Card className={classes.contactCard}>
                <CardHeader title={
                    <Typography fontSize={15}>{contact.name}</Typography>
                }
                            subheader={
                                <Typography fontSize={15}>{contact.phone || contact.tel[0]}</Typography>
                            }
                />
            </Card>
        )
    }

}