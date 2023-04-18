import Card from '@mui/material/Card';
import {CardContent, Typography} from "@mui/material";
import * as React from "react";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
    safePointCard: {
        width: "90%",
        margin: "auto",
        fontFamily: "Raleway",
    },
})

export default function SafePointCard({safePoint}) {
    const classes = useStyles();
    return (
        <Card className={classes.safePointCard}>
            <CardContent>

                <Typography fontSize={20}>
                    {safePoint ? safePoint.name : " "}
                </Typography>

                <Typography fontSize={15}>
                    {safePoint ? "Passphrase: " + safePoint.phrase : " "}
                </Typography>

            </CardContent>
        </Card>
    )
}

//https://mui.com/material-ui/react-snackbar/