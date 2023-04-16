import React from 'react';
import {Switch} from "@mui/material";
import {makeStyles} from "@material-ui/core";


const useStyles = makeStyles({
    outer_sms: {
        display: "flex",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "space-between"
    },
})


function SoundComponent({handleChange, editAlert}) {
    const classes = useStyles();

    return (
        <div className={classes.outer_sms}>
            <p>Sound Alarm</p>

            <Switch
                onChange={handleChange}
                id={"alarm"}
                defaultChecked={editAlert ? editAlert.alarm : false}
            />
        </div>
    );
}

export default SoundComponent